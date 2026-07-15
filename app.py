from flask import Flask, render_template, request, jsonify
from datetime import datetime
import os
import threading
import time
import urllib.request
from PIL import Image

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

init_db(app)
register_admin_routes(app)
start_keep_alive()


def get_image_aspect_ratio(image_path):
    """Get aspect ratio of an image"""
    try:
        with Image.open(image_path) as img:
            width, height = img.size
            return width / height
    except:
        return 1.0

def categorize_images_by_orientation(folder_path):
    """Categorize images by orientation"""
    landscape = []
    portrait = []
    square = []
    
    if os.path.isdir(folder_path):
        for f in sorted(os.listdir(folder_path)):
            if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp', '.gif')):
                full_path = os.path.join(folder_path, f)
                ratio = get_image_aspect_ratio(full_path)
                relative_path = f'images/about/{f}'
                
                if ratio > 1.2:
                    landscape.append(relative_path)
                elif ratio < 0.8:
                    portrait.append(relative_path)
                else:
                    square.append(relative_path)
    
    return {
        'landscape': landscape,
        'portrait': portrait,
        'square': square,
        'all': landscape + portrait + square
    }

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
    
    # Dynamically find about images and categorize
    about_folder = os.path.join(app.static_folder, 'images', 'about')
    about_images = categorize_images_by_orientation(about_folder)
    
    return render_template(
        'index.html', 
        brand_logos=brand_logos, 
        testimonials=testimonials, 
        products=products_and_services,
        portfolio_projects=portfolio_projects,
        about_images=about_images
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