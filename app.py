from flask import Flask, render_template, request, jsonify
from datetime import datetime
import os
import smtplib
import threading
import time
import urllib.request
from email.message import EmailMessage

from admin_panel import init_db, register_admin_routes, save_inquiry

app = Flask(__name__)

# Import the data loader
from data_loader import DataLoader


def start_keep_alive():
    def worker():
        while True:
            try:
                urllib.request.urlopen('https://www.kalyanienterprises.com/', timeout=10)
            except Exception:
                pass
            time.sleep(5 * 60)

    thread = threading.Thread(target=worker, daemon=True, name='keep-alive-pinger')
    thread.start()
    return thread

# Initialize data loader
loader = DataLoader()


def get_email_config(env=None):
    env = env or os.environ
    username = env.get('SMTP_USERNAME', 'keindia@outlook.in').strip()
    password = env.get('SMTP_PASSWORD', '').strip()
    to_email = env.get('SMTP_TO_EMAIL', 'kdevi9162@gmail.com').strip()

    enabled = bool(username and password and to_email)
    if env.get('EMAIL_NOTIFICATIONS_ENABLED') is not None:
        enabled = env.get('EMAIL_NOTIFICATIONS_ENABLED').lower() in {'1', 'true', 'yes', 'on'}

    return {
        'enabled': enabled,
        'smtp_host': env.get('SMTP_HOST', 'smtp-mail.outlook.com'),
        'smtp_port': int(env.get('SMTP_PORT', '587')),
        'username': username,
        'password': password,
        'to_email': to_email,
        'from_email': env.get('SMTP_FROM_EMAIL', username or 'noreply@example.com'),
    }


def send_inquiry_notification(name, email, phone, message, product, env=None):
    config = get_email_config(env)
    if not config['enabled']:
        return False

    msg = EmailMessage()
    msg['Subject'] = f'New inquiry from {name or "Website Visitor"}'
    msg['From'] = config['from_email']
    msg['To'] = config['to_email']
    msg.set_content(
        f"Name: {name or 'N/A'}\n"
        f"Email: {email or 'N/A'}\n"
        f"Phone: {phone or 'N/A'}\n"
        f"Product: {product or 'General Inquiry'}\n\n"
        f"Message:\n{message or 'No message provided'}"
    )

    try:
        with smtplib.SMTP(config['smtp_host'], config['smtp_port']) as server:
            server.starttls()
            server.login(config['username'], config['password'])
            server.send_message(msg)
        return True
    except Exception:
        return False


init_db(app)
register_admin_routes(app)
start_keep_alive()


@app.route('/')
def index():
    """Home page"""
    # Load all data from JSON files
    products = loader.get_all_products()
    services = loader.get_all_services()
    testimonials = loader.get_testimonials()
    portfolio_projects = loader.get_portfolio()
    
    # Combine products and services for display
    products_and_services = products + services
    
    # Dynamically find all brand logos
    brand_logos = []
    brand_folder = os.path.join(app.static_folder, 'images', 'brands')
    if os.path.isdir(brand_folder):
        for f in os.listdir(brand_folder):
            if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg')):
                brand_logos.append('images/brands/' + f)
    
    return render_template(
        'index.html', 
        brand_logos=brand_logos, 
        testimonials=testimonials, 
        products=products_and_services,
        portfolio_projects=portfolio_projects
    )

@app.route('/product/<product_id>')
def product_detail(product_id):
    """Product detail page"""
    product = loader.get_product_by_id(product_id)
    
    if not product:
        return render_template('404.html', message="Product not found"), 404
    
    # Get related products
    all_products = loader.get_all_products()
    related_products = []
    if 'related_products' in product:
        related_products = [p for p in all_products if p['id'] in product['related_products']]
    
    return render_template(
        'product_detail.html', 
        product=product, 
        related_products=related_products
    )

@app.route('/service/<service_id>')
def service_detail(service_id):
    """Service detail page"""
    service = loader.get_service_by_id(service_id)
    
    if not service:
        return render_template('404.html', message="Service not found"), 404
    
    return render_template('service_detail.html', service=service)

@app.route('/products')
def all_products():
    """All products page"""
    products = loader.get_all_products()
    return render_template('products.html', products=products)

@app.route('/services')
def all_services():
    """All services page"""
    services = loader.get_all_services()
    return render_template('services.html', services=services)

@app.route('/submit_inquiry', methods=['POST'])
def submit_inquiry():
    """Handle contact form submission"""
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        phone = data.get('phone')
        message = data.get('message')
        product = data.get('product', 'General Inquiry')
        
        # Save inquiry to the configured database
        save_inquiry(app, name, email, phone, message, product)
        # Email notifications are temporarily disabled on the main site.
        # send_inquiry_notification(name, email, phone, message, product)
        
        return jsonify({
            'success': True, 
            'message': 'Thank you! We will contact you soon.'
        })
    except Exception as e:
        return jsonify({
            'success': False, 
            'message': f'Error: {str(e)}'
        }), 500

@app.route('/api/products')
def api_products():
    """API endpoint for products"""
    products = loader.get_all_products()
    return jsonify(products)

@app.route('/api/services')
def api_services():
    """API endpoint for services"""
    services = loader.get_all_services()
    return jsonify(services)

@app.route('/api/product/<product_id>')
def api_product(product_id):
    """API endpoint for single product"""
    product = loader.get_product_by_id(product_id)
    if product:
        return jsonify(product)
    return jsonify({'error': 'Product not found'}), 404

@app.route('/api/service/<service_id>')
def api_service(service_id):
    """API endpoint for single service"""
    service = loader.get_service_by_id(service_id)
    if service:
        return jsonify(service)
    return jsonify({'error': 'Service not found'}), 404

@app.errorhandler(404)
def page_not_found(e):
    """Custom 404 page"""
    return render_template('404.html', message="Page not found"), 404

@app.errorhandler(500)
def internal_error(e):
    """Custom 500 page"""
    return render_template('500.html', message="Internal server error"), 500

# Template filters
@app.template_filter('format_price')
def format_price(value):
    """Format price with commas"""
    if isinstance(value, str):
        return value
    return f"₹{value:,.0f}"

@app.template_filter('truncate_words')
def truncate_words(text, length=20):
    """Truncate text to specified number of words"""
    words = text.split()
    if len(words) <= length:
        return text
    return ' '.join(words[:length]) + '...'

if __name__ == '__main__':
    app.run(debug=True,port=8080)