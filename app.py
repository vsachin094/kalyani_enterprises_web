from flask import Flask, render_template, request, jsonify
from datetime import datetime
import os

app = Flask(__name__)

testimonials = [
    {
        'name': 'Customer 1',
        'location': 'Giridih',
        'text': 'Excellent service and quality products. Very satisfied with the solar installation.',
        'rating': 5,
        'photo': 'testimonials/customer1.jpg'  # Path relative to static folder
    },
    {
        'name': 'Customer 2',
        'location': 'Sariya',
        'text': 'Professional team and timely delivery. Highly recommended!',
        'rating': 5,
        'photo': 'testimonials/customer2.jpg'
    },
    {
        'name': 'Customer 3',
        'location': 'Rajdhanwar',
        'text': 'Great experience with Kalyani Enterprises. Best prices in the region.',
        'rating': 5,
        # no photo key means default icon will be used
    },
    # Add more testimonials as needed...
]


products = [
    {
        'name': 'Livguard Solar Panels',
        'image': 'products/livguard_solar_panel.png',
        'features': [
            'Mono PERC & Halfcut Technology',
            '540W - 550W Capacity',
            '25-Year Performance Warranty',
            'High Efficiency Modules'
        ]
    },
    {
        'name': 'Livguard Batteries',
        'image': 'products/livguard_battery.png',
        'features': [
            'Tall Tubular & Flat Plate',
            'Enhanced Safety Features',
            'Long Backup Duration',
            'Low Maintenance Design'
        ]
    },
    {
        'name': 'Eastman Solar Panels',
        'image': 'products/eastman_solar.png',
        'features': [
            'MONO PERC Technology',
            '550W Halfcut Panels',
            'Superior Performance',
            'Weather Resistant'
        ]
    },
    {
        'name': 'Power Inverters',
        'image': 'products/livguard_inverter.png',
        'features': [
            'Pure Sine Wave Output',
            'Smart Battery Management',
            'LCD Display Panel',
            'Overload Protection'
        ]
    },
    {
        'name': 'Solar Inverters',
        'image': '',  # No image
        'features': [
            'MPPT Technology',
            'Grid & Off-Grid Systems',
            'High Conversion Efficiency',
            'Remote Monitoring'
        ]
    },
    {
        'name': 'Complete Solutions',
        'image': 'products/solar_solution.png',
        'features': [
            'Residential Solar Systems',
            'Commercial Installations',
            'Off-Grid Power Backup',
            'Professional Installation'
        ]
    }
]


@app.route('/')
def index():
    # Dynamically find all images in static/images/brands (any extension)
    brand_logos = []
    brand_folder = os.path.join(app.static_folder, 'images', 'brands')
    if os.path.isdir(brand_folder):
        for f in os.listdir(brand_folder):
            if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.tif', '.svg')):
                brand_logos.append('images/brands/' + f)
    return render_template('index.html', brand_logos=brand_logos,testimonials=testimonials,products=products)

@app.route('/submit_inquiry', methods=['POST'])
def submit_inquiry():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        phone = data.get('phone')
        message = data.get('message')
        
        # Log inquiry to file
        with open('inquiries.txt', 'a') as f:
            f.write(f"\n{'='*50}\n")
            f.write(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"Name: {name}\n")
            f.write(f"Email: {email}\n")
            f.write(f"Phone: {phone}\n")
            f.write(f"Message: {message}\n")
        
        return jsonify({'success': True, 'message': 'Thank you! We will contact you soon.'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)
    #test
