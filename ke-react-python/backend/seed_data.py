"""
Seed the database with the JSON files bundled with this project.
Run: python seed_data.py
"""
import json
import os
import sys
import uuid
from pathlib import Path

from database import SessionLocal, Base, engine
from models import Product, Testimonial, PortfolioProject, BrandLogo, AdminUser
from routers.admin import get_password_hash
from config import setting

# Project-owned seed data. This keeps the repository portable and independent.
SEED_DATA_DIR = Path(__file__).parent / "seed-data"


def load_json(filepath):
    """Load JSON file"""
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"  [SKIP] File not found: {filepath}")
        return None
    except json.JSONDecodeError as e:
        print(f"  [ERROR] Invalid JSON in {filepath}: {e}")
        return None


def seed_products(db):
    """Seed products and services from JSON files"""
    print("\n=== Seeding Products & Services ===")

    products_dir = SEED_DATA_DIR / "products"
    services_dir = SEED_DATA_DIR / "services"

    count = 0

    # Products
    if products_dir.exists():
        for json_file in sorted(products_dir.glob("*.json")):
            data = load_json(json_file)
            if not data:
                continue
            product_id = json_file.stem
            existing = db.query(Product).filter(Product.id == product_id).first()
            if existing:
                print(f"  [SKIP] Product '{product_id}' already exists")
                continue

            product = Product(
                id=product_id,
                name=data.get("name", product_id),
                type="Product",
                order=data.get("order", 999),
                short_description=data.get("short_description"),
                image=data.get("image"),
                features=data.get("features", []),
                full_description=data.get("full_description"),
                specifications=data.get("specifications"),
                benefits=data.get("benefits", []),
                applications=data.get("applications", []),
                brands=data.get("brands", []),
                gallery=data.get("gallery", []),
                catalog_pdf=data.get("catalog_pdf"),
                price_range=data.get("price_range"),
                availability=data.get("availability"),
                related_products=data.get("related_products", []),
            )
            db.add(product)
            count += 1
            print(f"  [OK] Product: {product.name}")

    # Services
    if services_dir.exists():
        for json_file in sorted(services_dir.glob("*.json")):
            data = load_json(json_file)
            if not data:
                continue
            service_id = json_file.stem
            existing = db.query(Product).filter(Product.id == service_id).first()
            if existing:
                print(f"  [SKIP] Service '{service_id}' already exists")
                continue

            service = Product(
                id=service_id,
                name=data.get("name", service_id),
                type="Service",
                order=data.get("order", 999),
                short_description=data.get("short_description"),
                image=data.get("image"),
                features=data.get("features", []),
                full_description=data.get("full_description"),
                specifications=data.get("specifications"),
                benefits=data.get("benefits", []),
                applications=data.get("applications", []),
                brands=data.get("brands", []),
                gallery=data.get("gallery", []),
                catalog_pdf=data.get("catalog_pdf"),
                price_range=data.get("price_range"),
                availability=data.get("availability"),
                related_products=data.get("related_products", []),
                process=data.get("process", []),
                included_services=data.get("included_services", []),
                duration=data.get("duration"),
                warranty=data.get("warranty"),
                service_areas=data.get("service_areas", []),
            )
            db.add(service)
            count += 1
            print(f"  [OK] Service: {service.name}")

    db.commit()
    print(f"  Total added: {count}")


def seed_testimonials(db):
    """Seed testimonials from JSON file"""
    print("\n=== Seeding Testimonials ===")

    data = load_json(SEED_DATA_DIR / "testimonials.json")
    if not data:
        return

    count = 0
    for item in data:
        existing = db.query(Testimonial).filter(
            Testimonial.name == item.get("name"),
            Testimonial.text == item.get("text"),
        ).first()
        if existing:
            continue

        testimonial = Testimonial(
            id=str(uuid.uuid4()),
            name=item.get("name", ""),
            location=item.get("location", ""),
            text=item.get("text", ""),
            rating=item.get("rating", 5),
            photo=item.get("photo"),
            project_type=item.get("project_type", "Customer experience"),
            date=item.get("date"),
            status="approved",
        )
        db.add(testimonial)
        count += 1
        print(f"  [OK] Testimonial: {testimonial.name}")

    db.commit()
    print(f"  Total added: {count}")


def seed_portfolio(db):
    """Seed portfolio projects from JSON file"""
    print("\n=== Seeding Portfolio Projects ===")

    data = load_json(SEED_DATA_DIR / "portfolio.json")
    if not data:
        return

    count = 0
    for item in data:
        project_id = item.get("title", "").lower().replace(" ", "-").replace("/", "-")
        existing = db.query(PortfolioProject).filter(PortfolioProject.id == project_id).first()
        if existing:
            continue

        project = PortfolioProject(
            id=project_id,
            title=item.get("title", ""),
            type=item.get("type", "Residential"),
            capacity=item.get("capacity"),
            location=item.get("location"),
            date=item.get("date"),
            image=item.get("image"),
            description=item.get("description"),
            client=item.get("client"),
            details=item.get("details", {}),
        )
        db.add(project)
        count += 1
        print(f"  [OK] Project: {project.title}")

    db.commit()
    print(f"  Total added: {count}")


def seed_brand_logos(db):
    """Seed brand logos from JSON file"""
    print("\n=== Seeding Brand Logos ===")

    data = load_json(SEED_DATA_DIR / "brand-logos.json")
    if not data:
        return

    count = 0
    for item in data:
        brand_id = item.get("name", "").lower().replace(" ", "-")
        existing = db.query(BrandLogo).filter(BrandLogo.id == brand_id).first()
        if existing:
            continue

        brand = BrandLogo(
            id=brand_id,
            name=item.get("name", ""),
            image=item.get("image"),
            alt=item.get("alt", ""),
            relationship=item.get("relationship", "channel"),
        )
        db.add(brand)
        count += 1
        print(f"  [OK] Brand: {brand.name}")

    db.commit()
    print(f"  Total added: {count}")


def seed_admin_user(db):
    """Create default admin user if none exists"""
    print("\n=== Seeding Admin User ===")

    existing = db.query(AdminUser).first()
    if existing:
        print(f"  [SKIP] Admin user already exists: {existing.username}")
        return

    username = setting("admin", "username", "ADMIN_USERNAME", "admin")
    password = setting("admin", "password", "ADMIN_PASSWORD")
    if not password:
        if os.getenv("APP_ENV", "development") == "production":
            raise RuntimeError("ADMIN_PASSWORD must be set in production")
        password = "change-this-password"

    admin = AdminUser(
        id=str(uuid.uuid4()),
        username=username,
        password_hash=get_password_hash(password),
    )
    db.add(admin)
    db.commit()
    print(f"  [OK] Admin user created: {username}")


def main():
    """Main seed function"""
    print("=" * 50)
    print("Kalyani Enterprises - Database Seeder")
    print("=" * 50)

    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        seed_products(db)
        seed_testimonials(db)
        seed_portfolio(db)
        seed_brand_logos(db)
        seed_admin_user(db)
        print("\n=== Seeding Complete ===")
    finally:
        db.close()


if __name__ == "__main__":
    main()
