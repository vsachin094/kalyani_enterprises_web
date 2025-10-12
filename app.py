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


products_and_services = [
    # 🌞 PRODUCTS
    {
        'name': 'Solar Panels',
        'type': 'Product',
        'image': 'products/solar_panels.png',
        'features': [
            'Mono PERC & Halfcut Technology',
            '540W - 550W High-Efficiency Modules',
            '25-Year Performance Warranty',
            'Available from Leading Brands: Livguard Solar, Eastman Solar, Indpower'
        ]
    },
    {
        'name': 'Solar Batteries',
        'type': 'Product',
        'image': 'products/solar_battery.png',
        'features': [
            'Tall Tubular & Flat Plate Options',
            'Deep Cycle Design for Solar Applications',
            'Long Backup Duration with Low Maintenance',
            'Available from Livguard Energy, Eastman & Indpower'
        ]
    },
    {
        'name': 'Power Inverters',
        'type': 'Product',
        'image': 'products/power_inverter.png',
        'features': [
            'Pure Sine Wave Output for Sensitive Equipment',
            'Smart Battery Management System',
            'LCD Display & Overload Protection',
            'Options from Livguard, Eastman & Indpower'
        ]
    },
    {
        'name': 'Solar Inverters',
        'type': 'Product',
        'image': 'products/solar_inverter.png',
        'features': [
            'Advanced MPPT Technology',
            'Supports Grid & Off-Grid Systems',
            'High Conversion Efficiency with Remote Monitoring',
            'Available Across Multiple Brands'
        ]
    },
    {
        'name': 'Energy Storage Systems',
        'type': 'Product',
        'image': 'products/energy_storage.png',
        'features': [
            'Scalable Energy Backup Solutions',
            'Hybrid Inverter Compatibility',
            'Smart Load Management',
            'Ideal for Homes, Petrol Pumps & Commercial Use'
        ]
    },

    # 🧰 SERVICES
    {
        'name': 'Solar Installation',
        'type': 'Service',
        'image': 'services/installation.png',
        'features': [
            'Complete Solar System Setup',
            'Professional On-Site Installation',
            'Trained Technicians for Residential & Commercial Projects',
            'End-to-End Commissioning Support'
        ]
    },
    {
        'name': 'Maintenance & Support',
        'type': 'Service',
        'image': 'services/maintenance.png',
        'features': [
            'Regular System Health Checks',
            'Preventive and Corrective Maintenance',
            'Performance Optimization',
            '24x7 Service Assistance'
        ]
    },
    {
        'name': 'Site Inspection & Consultation',
        'type': 'Service',
        'image': 'services/site_inspection.png',
        'features': [
            'Detailed Site Assessment for Solar Feasibility',
            'Energy Load Analysis',
            'System Design Recommendations',
            'Customized Power Solutions'
        ]
    },
    {
        'name': 'Custom Power Solutions',
        'type': 'Service',
        'image': 'services/power_solutions.png',
        'features': [
            'Tailored Solutions for Petrol Pumps, Buildings & Factories',
            'Grid-Tied, Hybrid & Off-Grid Setups',
            'Project Design, Supply & Installation',
            'Turnkey Execution from Start to Finish'
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
    return render_template('index.html', brand_logos=brand_logos, testimonials=testimonials, products=products_and_services)

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
