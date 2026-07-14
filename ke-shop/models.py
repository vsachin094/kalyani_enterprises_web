from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import json

db = SQLAlchemy()

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    role = db.Column(db.String(20), default='customer')
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    addresses = db.relationship('Address', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    orders = db.relationship('Order', backref='user', lazy='dynamic')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Address(db.Model):
    __tablename__ = 'addresses'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    address_line1 = db.Column(db.String(200), nullable=False)
    address_line2 = db.Column(db.String(200))
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    pincode = db.Column(db.String(10), nullable=False)
    is_default = db.Column(db.Boolean, default=False)
    
    def to_dict(self):
        return {
            'full_name': self.full_name,
            'phone': self.phone,
            'address_line1': self.address_line1,
            'address_line2': self.address_line2,
            'city': self.city,
            'state': self.state,
            'pincode': self.pincode
        }

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(200), unique=True, nullable=False, index=True)
    brand = db.Column(db.String(100))
    category = db.Column(db.String(100), nullable=False, index=True)
    short_description = db.Column(db.String(500))
    full_description = db.Column(db.Text)
    image = db.Column(db.String(300))
    status = db.Column(db.String(20), default='active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    variants = db.relationship('ProductVariant', backref='product', lazy='dynamic', cascade='all, delete-orphan')
    
    def get_price_range(self):
        vs = self.variants.all()
        if not vs:
            return "Contact for price"
        prices = [v.price for v in vs]
        min_p = min(prices)
        max_p = max(prices)
        if min_p == max_p:
            return f"₹{min_p:,.0f}"
        return f"₹{min_p:,.0f} - ₹{max_p:,.0f}"

class ProductVariant(db.Model):
    __tablename__ = 'product_variants'
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False, index=True)
    capacity = db.Column(db.String(50))
    warranty_months = db.Column(db.Integer)
    price = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, default=0)
    sku = db.Column(db.String(100), unique=True)
    is_active = db.Column(db.Boolean, default=True)
    
    @property
    def warranty_years(self):
        return round(self.warranty_months / 12, 1) if self.warranty_months else 0

class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(50), unique=True, nullable=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    subtotal = db.Column(db.Float, nullable=False)
    shipping_charge = db.Column(db.Float, default=0)
    total = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default='pending')
    payment_status = db.Column(db.String(50), default='pending')
    payment_method = db.Column(db.String(50))
    shipping_address = db.Column(db.Text)
    customer_notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    items = db.relationship('OrderItem', backref='order', lazy='dynamic', cascade='all, delete-orphan')
    
    def get_shipping_address(self):
        return json.loads(self.shipping_address) if self.shipping_address else {}
    
    def set_shipping_address(self, address_dict):
        self.shipping_address = json.dumps(address_dict)

class OrderItem(db.Model):
    __tablename__ = 'order_items'
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False, index=True)
    product_name = db.Column(db.String(200), nullable=False)
    brand = db.Column(db.String(100))
    variant_capacity = db.Column(db.String(50))
    variant_warranty = db.Column(db.Integer)
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    subtotal = db.Column(db.Float, nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'))
    variant_id = db.Column(db.Integer, db.ForeignKey('product_variants.id'))
