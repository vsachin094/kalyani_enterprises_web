import urllib.request
import os
import ssl

# Create an SSL context that doesn't verify certificates
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

# Create directory for product images
os.makedirs("static/images/products", exist_ok=True)

# Product images to download
images = {
    "livguard_solar_panel.png": "https://www.livguardsolar.com/static-assets/products/solar_panel.png",
    "livguard_battery.png": "https://www.livguard.com/static-assets/products/battery.png",
    "livguard_inverter.png": "https://www.livguard.com/static-assets/products/inverter.png",
    "solar_solution.png": "https://www.livguardsolar.com/static-assets/products/solar_solution.png",
}

# Backup placeholders if download fails
placeholder_images = {
    "eastman_solar.png": "https://via.placeholder.com/200x150/4CAF50/ffffff?text=Eastman+Solar",
    "solar_inverter.png": "https://via.placeholder.com/200x150/FF9800/ffffff?text=Solar+Inverter",
}

print("Downloading product images...\n")

for filename, url in images.items():
    try:
        filepath = f"static/images/products/{filename}"
        with urllib.request.urlopen(url, context=ssl_context) as response:
            with open(filepath, 'wb') as f:
                f.write(response.read())
        print(f"✓ Downloaded: {filename}")
    except Exception as e:
        print(f"✗ Failed: {filename} - {e}")

# Download placeholder images
for filename, url in placeholder_images.items():
    try:
        filepath = f"static/images/products/{filename}"
        with urllib.request.urlopen(url, context=ssl_context) as response:
            with open(filepath, 'wb') as f:
                f.write(response.read())
        print(f"✓ Downloaded: {filename}")
    except Exception as e:
        print(f"✗ Failed: {filename} - {e}")

print("\n✓ All product images downloaded to static/images/products/")
print("\nYou can replace placeholder images with actual Eastman product photos.")