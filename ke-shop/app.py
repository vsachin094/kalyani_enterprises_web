from flask import Flask, render_template, request, jsonify, redirect, url_for, flash, session
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from werkzeug.utils import secure_filename
from functools import wraps
import os, uuid
from datetime import datetime
from config import Config
from models import db, User, Address, Product, ProductVariant, Order, OrderItem
from db_manager import init_database

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

def admin_required(f):
    @wraps(f)
    @login_required
    def decorated(*args, **kwargs):
        if current_user.role != 'admin':
            flash('Admin access required', 'danger')
            return redirect(url_for('home'))
        return f(*args, **kwargs)
    return decorated

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/')
def home():
    products = Product.query.filter_by(status='active').limit(8).all()
    categories = db.session.query(Product.category).distinct().all()
    return render_template('home.html', featured_products=products, categories=[c[0] for c in categories])

@app.route('/products')
def products():
    category = request.args.get('category')
    q = Product.query.filter_by(status='active')
    if category:
        q = q.filter_by(category=category)
    products_list = q.all()
    categories = db.session.query(Product.category).distinct().all()
    return render_template('products.html', products=products_list, categories=[c[0] for c in categories], selected_category=category)

@app.route('/product/<int:product_id>')
def product_detail(product_id):
    product = Product.query.get_or_404(product_id)
    variants = product.variants.filter_by(is_active=True).all()
    return render_template('product_detail.html', product=product, variants=variants)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    if request.method == 'POST':
        email = request.form.get('email')
        if User.query.filter_by(email=email).first():
            flash('Email already registered', 'danger')
        else:
            user = User(email=email, name=request.form.get('name'), phone=request.form.get('phone'), role='customer')
            user.set_password(request.form.get('password'))
            db.session.add(user)
            db.session.commit()
            flash('Registration successful! Please login.', 'success')
            return redirect(url_for('login'))
    return render_template('auth/register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('admin_dashboard' if current_user.role == 'admin' else 'home'))
    if request.method == 'POST':
        user = User.query.filter_by(email=request.form.get('email'), is_active=True).first()
        if user and user.check_password(request.form.get('password')):
            login_user(user, remember=True)
            flash(f'Welcome, {user.name}!', 'success')
            if user.role == 'admin':
                return redirect(url_for('admin_dashboard'))
            next_page = request.args.get('next')
            return redirect(next_page) if next_page else redirect(url_for('home'))
        flash('Invalid email or password', 'danger')
    return render_template('auth/login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Logged out successfully', 'success')
    return redirect(url_for('home'))

@app.route('/cart')
def cart():
    cart_items = session.get('cart', [])
    subtotal = sum(item['price'] * item['quantity'] for item in cart_items)
    return render_template('cart.html', cart_items=cart_items, subtotal=subtotal)

@app.route('/add-to-cart', methods=['POST'])
def add_to_cart():
    try:
        data = request.get_json()
        if 'cart' not in session:
            session['cart'] = []
        cart = session['cart']
        for item in cart:
            if item['variant_id'] == data['variant_id']:
                item['quantity'] += data['quantity']
                session.modified = True
                return jsonify({'success': True, 'cart_count': len(cart)})
        cart.append(data)
        session['cart'] = cart
        session.modified = True
        return jsonify({'success': True, 'cart_count': len(cart)})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/remove-from-cart/<int:index>')
def remove_from_cart(index):
    cart = session.get('cart', [])
    if 0 <= index < len(cart):
        cart.pop(index)
        session['cart'] = cart
        session.modified = True
        flash('Item removed from cart', 'success')
    return redirect(url_for('cart'))

@app.route('/checkout')
@login_required
def checkout():
    cart_items = session.get('cart', [])
    if not cart_items:
        flash('Your cart is empty', 'warning')
        return redirect(url_for('products'))
    subtotal = sum(item['price'] * item['quantity'] for item in cart_items)
    shipping = 0 if subtotal >= 50000 else 500
    total = subtotal + shipping
    addresses = Address.query.filter_by(user_id=current_user.id).all()
    return render_template('checkout.html', cart_items=cart_items, subtotal=subtotal, shipping=shipping, total=total, addresses=addresses)

@app.route('/place-order', methods=['POST'])
@login_required
def place_order():
    try:
        cart_items = session.get('cart', [])
        if not cart_items:
            flash('Cart is empty', 'warning')
            return redirect(url_for('cart'))
        subtotal = sum(item['price'] * item['quantity'] for item in cart_items)
        shipping = 0 if subtotal >= 50000 else 500
        total = subtotal + shipping
        order = Order(
            order_number=f"KE{datetime.now().strftime('%Y%m%d')}{uuid.uuid4().hex[:6].upper()}",
            user_id=current_user.id, subtotal=subtotal, shipping_charge=shipping, total=total,
            status='pending', payment_status='pending', payment_method=request.form.get('payment_method', 'cod')
        )
        db.session.add(order)
        db.session.flush()
        for item in cart_items:
            order_item = OrderItem(
                order_id=order.id, product_name=item['product_name'],
                variant_capacity=item.get('capacity'), variant_warranty=item.get('warranty_months'),
                price=item['price'], quantity=item['quantity'], subtotal=item['price'] * item['quantity'],
                product_id=item.get('product_id'), variant_id=item.get('variant_id')
            )
            db.session.add(order_item)
        db.session.commit()
        session['cart'] = []
        session.modified = True
        flash('Order placed successfully!', 'success')
        return redirect(url_for('order_confirmation', order_id=order.id))
    except Exception as e:
        db.session.rollback()
        flash(f'Error: {str(e)}', 'danger')
        return redirect(url_for('checkout'))

@app.route('/order/<int:order_id>')
@login_required
def order_confirmation(order_id):
    order = Order.query.get_or_404(order_id)
    if order.user_id != current_user.id and current_user.role != 'admin':
        flash('Access denied', 'danger')
        return redirect(url_for('home'))
    return render_template('order_confirmation.html', order=order)

@app.route('/admin')
@admin_required
def admin_dashboard():
    stats = {
        'total_products': Product.query.count(),
        'total_orders': Order.query.count(),
        'pending_orders': Order.query.filter_by(status='pending').count(),
        'total_customers': User.query.filter_by(role='customer').count()
    }
    recent_orders = Order.query.order_by(Order.created_at.desc()).limit(10).all()
    return render_template('admin/dashboard.html', stats=stats, recent_orders=recent_orders)

@app.route('/admin/products')
@admin_required
def admin_products():
    products = Product.query.all()
    return render_template('admin/products.html', products=products)

@app.route('/admin/products/add', methods=['GET', 'POST'])
@admin_required
def admin_add_product():
    if request.method == 'POST':
        try:
            image_path = None
            if 'image' in request.files:
                file = request.files['image']
                if file and allowed_file(file.filename):
                    filename = f"{uuid.uuid4().hex[:8]}_{secure_filename(file.filename)}"
                    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                    file.save(filepath)
                    image_path = f"images/products/{filename}"
            product = Product(
                name=request.form.get('name'), slug=request.form.get('name').lower().replace(' ', '-'),
                brand=request.form.get('brand'), category=request.form.get('category'),
                short_description=request.form.get('short_description'),
                full_description=request.form.get('full_description', ''), image=image_path, status='active'
            )
            db.session.add(product)
            db.session.flush()
            variant_count = int(request.form.get('variant_count', 0))
            for i in range(variant_count):
                variant = ProductVariant(
                    product_id=product.id, capacity=request.form.get(f'variant_capacity_{i}'),
                    warranty_months=int(request.form.get(f'variant_warranty_{i}')),
                    price=float(request.form.get(f'variant_price_{i}')),
                    stock=int(request.form.get(f'variant_stock_{i}')),
                    sku=f"{product.id}-{uuid.uuid4().hex[:6]}".upper()
                )
                db.session.add(variant)
            db.session.commit()
            flash('Product added successfully!', 'success')
            return redirect(url_for('admin_products'))
        except Exception as e:
            db.session.rollback()
            flash(f'Error: {str(e)}', 'danger')
    return render_template('admin/add_product.html')

# ==================== ADMIN ORDER MANAGEMENT ====================

@app.route('/admin/orders')
@admin_required
def admin_orders():
    """Admin orders list"""
    status_filter = request.args.get('status')
    if status_filter:
        orders = Order.query.filter_by(status=status_filter).order_by(Order.created_at.desc()).all()
    else:
        orders = Order.query.order_by(Order.created_at.desc()).all()
    return render_template('admin/orders.html', orders=orders, status_filter=status_filter)

@app.route('/admin/orders/<int:order_id>')
@admin_required
def admin_order_detail(order_id):
    """Admin order detail view"""
    order = Order.query.get_or_404(order_id)
    return render_template('admin/order_detail.html', order=order)

@app.route('/admin/orders/<int:order_id>/update-status', methods=['POST'])
@admin_required
def admin_update_order_status(order_id):
    """Update order status"""
    order = Order.query.get_or_404(order_id)
    new_status = request.form.get('status')
    
    if new_status in ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']:
        order.status = new_status
        db.session.commit()
        flash(f'Order status updated to {new_status}', 'success')
    else:
        flash('Invalid status', 'danger')
    
    return redirect(url_for('admin_order_detail', order_id=order_id))

# ==================== CUSTOMER ORDER TRACKING ====================

@app.route('/my-orders')
@login_required
def my_orders():
    """Customer's order list"""
    orders = Order.query.filter_by(user_id=current_user.id).order_by(Order.created_at.desc()).all()
    return render_template('my_orders.html', orders=orders)

@app.route('/my-orders/<int:order_id>')
@login_required
def my_order_detail(order_id):
    """Customer order detail"""
    order = Order.query.get_or_404(order_id)
    if order.user_id != current_user.id:
        flash('Access denied', 'danger')
        return redirect(url_for('my_orders'))
    return render_template('my_order_detail.html', order=order)

init_database(app)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
