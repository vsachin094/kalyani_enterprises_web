import os
import json

def create_directory_structure():
    """Create all necessary directories and JSON files"""
    
    # Base directories
    directories = [
        'data',
        'data/products',
        'data/services',
        'static/catalogs'
    ]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"✓ Created directory: {directory}")
    
    # Product data
    products = {
        'solar-panels': {
            "name": "Solar Panels",
            "order": 1,
            "short_description": "540W - 550W High-Efficiency Solar Modules",
            "image": "products/livgaurd_solar.png",
            "features": [
                "Mono PERC & Halfcut Technology",
                "540W - 550W High-Efficiency Modules",
                "25-Year Performance Warranty",
                "Available from Leading Brands: Livguard Solar, Eastman Solar, Indpower"
            ],
            "full_description": "Our premium solar panels utilize the latest Mono PERC and Halfcut technology to deliver maximum efficiency and reliability. Perfect for residential, commercial, and industrial applications across Jharkhand.",
            "specifications": {
                "Power Output": "540W - 550W",
                "Technology": "Mono PERC & Halfcut",
                "Efficiency": "Up to 21.5%",
                "Warranty": "25 Years Performance, 12 Years Product",
                "Dimensions": "2278 x 1134 x 35 mm",
                "Weight": "28.5 kg",
                "Cell Type": "182mm Mono-crystalline",
                "Frame": "Anodized Aluminum Alloy"
            },
            "benefits": [
                "Higher energy output per square meter",
                "Better performance in low light conditions",
                "Reduced degradation over time",
                "Weather and corrosion resistant",
                "Easy installation and maintenance"
            ],
            "applications": [
                "Residential rooftop installations",
                "Commercial building complexes",
                "Industrial power plants",
                "Agricultural pump systems",
                "Off-grid and hybrid systems"
            ],
            "brands": ["Livguard Solar", "Eastman Solar", "Indpower"],
            "gallery": [
                "products/solar_panel_1.jpg",
                "products/solar_panel_2.jpg",
                "products/solar_panel_3.jpg"
            ],
            "catalog_pdf": "catalogs/solar-panels-catalog.pdf",
            "price_range": "₹20,000 - ₹25,000",
            "availability": "In Stock",
            "related_products": ["solar-inverters", "solar-batteries"]
        },
        'solar-batteries': {
            "name": "Solar Batteries",
            "order": 2,
            "short_description": "Deep Cycle Batteries for Solar Applications",
            "image": "products/livgaurd_bat.png",
            "features": [
                "Tall Tubular & Flat Plate Options",
                "Deep Cycle Design for Solar Applications",
                "Long Backup Duration with Low Maintenance",
                "Available from Livguard Energy, Eastman & Indpower"
            ],
            "full_description": "High-quality deep cycle batteries designed specifically for solar energy storage. Built to withstand frequent charge-discharge cycles with minimal maintenance requirements.",
            "specifications": {
                "Capacity Range": "100Ah - 220Ah",
                "Type": "Tubular / Flat Plate",
                "Voltage": "12V",
                "Warranty": "5 Years",
                "Life Cycles": "1500+ cycles at 80% DOD",
                "Charge Time": "8-10 hours"
            },
            "benefits": [
                "Long backup duration",
                "Low maintenance requirements",
                "Resistant to power fluctuations",
                "Excellent charge acceptance",
                "Suitable for deep discharge applications"
            ],
            "applications": [
                "Solar home systems",
                "Off-grid installations",
                "Backup power systems",
                "Inverter applications",
                "Hybrid solar systems"
            ],
            "brands": ["Livguard Energy", "Eastman", "Indpower"],
            "gallery": [
                "products/battery_1.jpg",
                "products/battery_2.jpg"
            ],
            "catalog_pdf": "catalogs/solar-batteries-catalog.pdf",
            "price_range": "₹8,000 - ₹18,000",
            "availability": "In Stock",
            "related_products": ["power-inverters", "solar-panels"]
        },
        'power-inverters': {
            "name": "Power Inverters",
            "order": 3,
            "short_description": "Pure Sine Wave Inverters for Home & Office",
            "image": "products/power_inverter.png",
            "features": [
                "Pure Sine Wave Output for Sensitive Equipment",
                "Smart Battery Management System",
                "LCD Display & Overload Protection",
                "Options from Livguard, Eastman & Indpower"
            ],
            "full_description": "Advanced pure sine wave inverters providing stable and reliable power backup for homes and offices. Features intelligent battery management and comprehensive protection systems.",
            "specifications": {
                "Capacity Range": "800VA - 3000VA",
                "Input Voltage": "230V AC",
                "Output": "Pure Sine Wave",
                "Efficiency": "Up to 90%",
                "Battery Type": "12V/24V",
                "Warranty": "2 Years"
            },
            "benefits": [
                "Pure sine wave for sensitive electronics",
                "Intelligent battery charging",
                "Overload and short circuit protection",
                "Low maintenance operation",
                "Silent operation"
            ],
            "applications": [
                "Home power backup",
                "Office equipment",
                "Medical devices",
                "Computer systems",
                "Telecommunication equipment"
            ],
            "brands": ["Livguard", "Eastman", "Indpower"],
            "gallery": [
                "products/inverter_1.jpg",
                "products/inverter_2.jpg"
            ],
            "catalog_pdf": "catalogs/power-inverters-catalog.pdf",
            "price_range": "₹5,000 - ₹25,000",
            "availability": "In Stock",
            "related_products": ["solar-batteries", "solar-inverters"]
        },
        'solar-inverters': {
            "name": "Solar Inverters",
            "order": 4,
            "short_description": "MPPT Solar Charge Controllers & Inverters",
            "image": "products/solar_inverter.png",
            "features": [
                "Advanced MPPT Technology",
                "Supports Grid & Off-Grid Systems",
                "High Conversion Efficiency with Remote Monitoring",
                "Available Across Multiple Brands"
            ],
            "full_description": "State-of-the-art solar inverters with Maximum Power Point Tracking (MPPT) technology for optimal energy harvest from solar panels. Suitable for both grid-tied and off-grid applications.",
            "specifications": {
                "Capacity Range": "1kW - 10kW",
                "MPPT Efficiency": "99.5%",
                "Type": "Hybrid / On-Grid / Off-Grid",
                "Display": "LCD with Wi-Fi",
                "Warranty": "5 Years",
                "Protection": "IP65 Rated"
            },
            "benefits": [
                "Maximum power extraction from panels",
                "Works with or without grid",
                "Remote monitoring capability",
                "Battery charging optimization",
                "Weather-resistant design"
            ],
            "applications": [
                "Residential solar systems",
                "Commercial installations",
                "Industrial applications",
                "Agricultural pumping",
                "Hybrid power systems"
            ],
            "brands": ["Livguard", "Eastman", "Indpower"],
            "gallery": [
                "products/solar_inv_1.jpg",
                "products/solar_inv_2.jpg"
            ],
            "catalog_pdf": "catalogs/solar-inverters-catalog.pdf",
            "price_range": "₹25,000 - ₹1,50,000",
            "availability": "In Stock",
            "related_products": ["solar-panels", "solar-batteries"]
        },
        'energy-storage': {
            "name": "Energy Storage Systems",
            "order": 5,
            "short_description": "Complete Energy Storage Solutions",
            "image": "products/energy_storage.png",
            "features": [
                "Scalable Energy Backup Solutions",
                "Hybrid Inverter Compatibility",
                "Smart Load Management",
                "Ideal for Homes, Petrol Pumps & Commercial Use"
            ],
            "full_description": "Comprehensive energy storage systems combining batteries, inverters, and intelligent management systems for reliable backup power and energy independence.",
            "specifications": {
                "Storage Capacity": "5kWh - 50kWh",
                "Battery Type": "Lithium-ion / Lead Acid",
                "System Voltage": "48V DC",
                "Warranty": "5-10 Years",
                "Life Cycles": "3000+ cycles",
                "Management": "Smart BMS"
            },
            "benefits": [
                "Complete backup solution",
                "Scalable capacity",
                "Intelligent power management",
                "Long service life",
                "Reduced electricity bills"
            ],
            "applications": [
                "Home energy storage",
                "Petrol pump backup",
                "Commercial establishments",
                "Industrial facilities",
                "Telecom towers"
            ],
            "brands": ["Livguard", "Eastman", "Indpower"],
            "gallery": [
                "products/storage_1.jpg",
                "products/storage_2.jpg"
            ],
            "catalog_pdf": "catalogs/energy-storage-catalog.pdf",
            "price_range": "₹50,000 - ₹5,00,000",
            "availability": "In Stock",
            "related_products": ["solar-inverters", "solar-batteries"]
        }
    }
    
    # Service data
    services = {
        'solar-installation': {
            "name": "Solar Installation",
            "order": 1,
            "short_description": "Professional Solar System Installation",
            "image": "services/installation.png",
            "features": [
                "Complete Solar System Setup",
                "Professional On-Site Installation",
                "Trained Technicians for Residential & Commercial Projects",
                "End-to-End Commissioning Support"
            ],
            "full_description": "Expert installation services for all types of solar systems. Our certified technicians ensure proper installation, testing, and commissioning for optimal performance.",
            "process": [
                {
                    "step": 1,
                    "title": "Site Assessment",
                    "description": "Detailed site survey and feasibility study"
                },
                {
                    "step": 2,
                    "title": "System Design",
                    "description": "Customized system design based on energy needs"
                },
                {
                    "step": 3,
                    "title": "Installation",
                    "description": "Professional mounting and electrical integration"
                },
                {
                    "step": 4,
                    "title": "Commissioning",
                    "description": "Testing, activation, and handover"
                }
            ],
            "included_services": [
                "Site survey and feasibility",
                "System design and documentation",
                "Structural mounting",
                "Electrical wiring and integration",
                "Inverter and battery setup",
                "Testing and commissioning",
                "Training and handover"
            ],
            "duration": "3-7 days",
            "warranty": "2 years installation warranty",
            "service_areas": ["Giridih", "Ranchi", "Dhanbad", "Jamshedpur", "Bokaro"],
            "gallery": [
                "services/install_1.jpg",
                "services/install_2.jpg"
            ]
        },
        'maintenance-support': {
            "name": "Maintenance & Support",
            "order": 2,
            "short_description": "Regular Maintenance & 24/7 Support",
            "image": "services/maintenance.png",
            "features": [
                "Regular System Health Checks",
                "Preventive and Corrective Maintenance",
                "Performance Optimization",
                "24x7 Service Assistance"
            ],
            "full_description": "Comprehensive maintenance and support services to ensure your solar system operates at peak efficiency throughout its lifetime.",
            "services_included": [
                "Quarterly system inspection",
                "Panel cleaning and maintenance",
                "Performance monitoring",
                "Inverter servicing",
                "Battery health check",
                "Connection tightening",
                "Remote troubleshooting"
            ],
            "plans": [
                {
                    "name": "Basic",
                    "features": ["Annual inspection", "Emergency support"],
                    "price": "₹3,000/year"
                },
                {
                    "name": "Standard",
                    "features": ["Quarterly inspection", "Priority support", "Free cleaning"],
                    "price": "₹8,000/year"
                },
                {
                    "name": "Premium",
                    "features": ["Monthly inspection", "24/7 support", "Free parts replacement"],
                    "price": "₹15,000/year"
                }
            ],
            "gallery": [
                "services/maint_1.jpg",
                "services/maint_2.jpg"
            ]
        },
        'site-inspection': {
            "name": "Site Inspection & Consultation",
            "order": 3,
            "short_description": "Expert Site Assessment & Energy Audit",
            "image": "services/site_inspection.png",
            "features": [
                "Detailed Site Assessment for Solar Feasibility",
                "Energy Load Analysis",
                "System Design Recommendations",
                "Customized Power Solutions"
            ],
            "full_description": "Comprehensive site inspection and consultation services to determine the best solar solution for your specific needs and location.",
            "inspection_includes": [
                "Roof/ground assessment",
                "Shadow analysis",
                "Structural evaluation",
                "Energy consumption audit",
                "System sizing recommendation",
                "ROI calculation",
                "Subsidy guidance"
            ],
            "deliverables": [
                "Detailed inspection report",
                "System design proposal",
                "Cost estimation",
                "ROI analysis",
                "Subsidy information"
            ],
            "cost": "Free for systems above 5kW",
            "duration": "2-3 hours",
            "gallery": [
                "services/inspect_1.jpg",
                "services/inspect_2.jpg"
            ]
        },
        'power-solutions': {
            "name": "Custom Power Solutions",
            "order": 4,
            "short_description": "Tailored Power Solutions for Every Need",
            "image": "services/power_solutions.png",
            "features": [
                "Tailored Solutions for Petrol Pumps, Buildings & Factories",
                "Grid-Tied, Hybrid & Off-Grid Setups",
                "Project Design, Supply & Installation",
                "Turnkey Execution from Start to Finish"
            ],
            "full_description": "End-to-end custom power solutions designed specifically for your application, whether residential, commercial, or industrial.",
            "solutions": [
                {
                    "type": "Petrol Pumps",
                    "description": "Complete backup solutions with battery storage for uninterrupted operations"
                },
                {
                    "type": "Commercial Buildings",
                    "description": "Grid-tied systems with net metering for maximum savings"
                },
                {
                    "type": "Industries",
                    "description": "High-capacity systems for reducing operational costs"
                },
                {
                    "type": "Agriculture",
                    "description": "Solar pump controllers and standalone systems"
                }
            ],
            "project_types": [
                "On-Grid Solar",
                "Off-Grid Solar",
                "Hybrid Solar",
                "Solar + DG Hybrid",
                "Microgrid Solutions"
            ],
            "gallery": [
                "services/custom_1.jpg",
                "services/custom_2.jpg"
            ]
        }
    }
    
    # Write product JSON files
    for filename, data in products.items():
        filepath = f'data/products/{filename}.json'
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"✓ Created product: {filepath}")
    
    # Write service JSON files
    for filename, data in services.items():
        filepath = f'data/services/{filename}.json'
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"✓ Created service: {filepath}")
    
    # Create testimonials.json
    testimonials = [
        {
            "name": "Customer 1",
            "location": "Giridih",
            "text": "Excellent service and quality products. Very satisfied with the solar installation.",
            "rating": 5,
            "photo": "testimonials/customer1.jpg"
        }
    ]
    
    with open('data/testimonials.json', 'w', encoding='utf-8') as f:
        json.dump(testimonials, f, indent=2, ensure_ascii=False)
    print("✓ Created: data/testimonials.json")
    
    # Create portfolio.json
    portfolio = []
    
    with open('data/portfolio.json', 'w', encoding='utf-8') as f:
        json.dump(portfolio, f, indent=2, ensure_ascii=False)
    print("✓ Created: data/portfolio.json")
    
    print("\n✅ All directories and JSON files created successfully!")
    print("\n📁 Structure created:")
    print("   data/")
    print("   ├── products/ (5 product files)")
    print("   ├── services/ (4 service files)")
    print("   ├── testimonials.json")
    print("   └── portfolio.json")

if __name__ == "__main__":
    create_directory_structure()
