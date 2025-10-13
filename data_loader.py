import json
import os
from pathlib import Path

class DataLoader:
    def __init__(self):
        self.base_path = Path(__file__).parent / 'data'
    
    def load_json(self, filepath):
        """Load JSON file"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            return None
        except json.JSONDecodeError:
            print(f"Error decoding JSON from {filepath}")
            return None
    
    def get_all_products(self):
        """Load all products from data/products/"""
        products = []
        products_dir = self.base_path / 'products'
        
        if products_dir.exists():
            for json_file in products_dir.glob('*.json'):
                data = self.load_json(json_file)
                if data:
                    data['id'] = json_file.stem  # Use filename as ID
                    data['type'] = 'Product'
                    products.append(data)
        
        return sorted(products, key=lambda x: x.get('order', 999))
    
    def get_all_services(self):
        """Load all services from data/services/"""
        services = []
        services_dir = self.base_path / 'services'
        
        if services_dir.exists():
            for json_file in services_dir.glob('*.json'):
                data = self.load_json(json_file)
                if data:
                    data['id'] = json_file.stem
                    data['type'] = 'Service'
                    services.append(data)
        
        return sorted(services, key=lambda x: x.get('order', 999))
    
    def get_product_by_id(self, product_id):
        """Get single product by ID"""
        filepath = self.base_path / 'products' / f'{product_id}.json'
        data = self.load_json(filepath)
        if data:
            data['id'] = product_id
            data['type'] = 'Product'
        return data
    
    def get_service_by_id(self, service_id):
        """Get single service by ID"""
        filepath = self.base_path / 'services' / f'{service_id}.json'
        data = self.load_json(filepath)
        if data:
            data['id'] = service_id
            data['type'] = 'Service'
        return data
    
    def get_testimonials(self):
        """Load testimonials"""
        return self.load_json(self.base_path / 'testimonials.json') or []
    
    def get_portfolio(self):
        """Load portfolio projects"""
        return self.load_json(self.base_path / 'portfolio.json') or []
