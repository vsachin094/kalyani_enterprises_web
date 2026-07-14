from models import db, User

def init_database(app):
    with app.app_context():
        db.create_all()
        print("✓ Database tables created")
        
        admin = User.query.filter_by(email=app.config['DEFAULT_ADMIN_EMAIL']).first()
        if not admin:
            admin = User(
                email=app.config['DEFAULT_ADMIN_EMAIL'],
                name='Administrator',
                role='admin',
                is_active=True
            )
            admin.set_password(app.config['DEFAULT_ADMIN_PASSWORD'])
            db.session.add(admin)
            db.session.commit()
            print(f"✓ Admin user created: {app.config['DEFAULT_ADMIN_EMAIL']}")
        else:
            print(f"✓ Admin user exists: {app.config['DEFAULT_ADMIN_EMAIL']}")
