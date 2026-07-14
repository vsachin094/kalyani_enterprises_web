from datetime import timedelta

class Config:
    SECRET_KEY = 'your-secret-key-change-in-production'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///kalyani_shop.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = 'static/images/products'
    MAX_CONTENT_LENGTH = 5 * 1024 * 1024
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)
    DEFAULT_ADMIN_EMAIL = 'admin@shop.com'
    DEFAULT_ADMIN_PASSWORD = 'admin123'
