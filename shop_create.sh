#!/bin/bash

echo "🚀 Creating Kalyani E-commerce Shop..."

# Create main directory
mkdir -p ke-shop
cd ke-shop

# Create folder structure
mkdir -p templates/auth
mkdir -p templates/admin
mkdir -p static/images/products

# Create Python files
touch requirements.txt
touch config.py
touch models.py
touch db_manager.py
touch app.py
touch README.md

# Create template files
touch templates/base.html
touch templates/home.html
touch templates/products.html
touch templates/product_detail.html
touch templates/cart.html
touch templates/checkout.html
touch templates/order_confirmation.html
touch templates/auth/login.html
touch templates/auth/register.html
touch templates/admin/dashboard.html
touch templates/admin/products.html
touch templates/admin/add_product.html

echo ""
echo "✅ Project structure created!"
echo ""
echo "📁 Project location: $(pwd)"
echo ""
echo "📝 Next steps:"
echo "1. cd ke-shop"
echo "2. Open each file and paste the code"
echo "3. pip3 install -r requirements.txt"
echo "4. python3 app.py"
echo ""
EOF