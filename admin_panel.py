import base64
import hashlib
import os
import sqlite3
from datetime import datetime
from urllib.parse import quote

from flask import jsonify, render_template, request


ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'sachin')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'ece@SK364')


def build_database_url(env=None):
    env = env or os.environ
    database_url = env.get('DATABASE_URL') or env.get('POSTGRES_URL')
    if database_url:
        return database_url

    db_user = env.get('DB_USER') or env.get('POSTGRES_USER') or env.get('DATABASE_USER') or ''
    db_password = env.get('DB_PASSWORD') or env.get('POSTGRES_PASSWORD') or env.get('DATABASE_PASSWORD') or ''
    db_host = env.get('DB_HOST') or env.get('POSTGRES_HOST') or 'localhost'
    db_port = env.get('DB_PORT') or env.get('POSTGRES_PORT') or '5432'
    db_name = env.get('DB_NAME') or env.get('POSTGRES_DB') or env.get('DATABASE_NAME')

    if not db_name:
        return None

    if db_user:
        return f"postgresql://{quote(db_user)}:{quote(db_password)}@{db_host}:{db_port}/{db_name}"
    return f"postgresql://{db_host}:{db_port}/{db_name}"


def get_db_path(app):
    configured_path = app.config.get('DATABASE_PATH')
    if configured_path:
        return configured_path
    os.makedirs(app.instance_path, exist_ok=True)
    return os.path.join(app.instance_path, 'site_admin.db')


def get_database_url(app=None):
    app_obj = app or globals().get('_APP')
    configured_url = None
    if app_obj is not None:
        configured_url = app_obj.config.get('DATABASE_URL') or app_obj.config.get('SQLALCHEMY_DATABASE_URI')
    if configured_url:
        return configured_url
    return build_database_url()


def is_postgres_database(app=None):
    database_url = get_database_url(app)
    return bool(database_url and database_url.startswith(('postgres://', 'postgresql://')))


def get_db_connection(app):
    database_url = get_database_url(app)
    if is_postgres_database(app):
        import psycopg2

        conn = psycopg2.connect(database_url)
        return conn

    conn = sqlite3.connect(get_db_path(app))
    conn.row_factory = sqlite3.Row
    return conn


def get_db_cursor(conn, app):
    if is_postgres_database(app):
        from psycopg2.extras import RealDictCursor

        return conn.cursor(cursor_factory=RealDictCursor)
    return conn.cursor()


def get_sql_placeholders(app):
    return '%s' if is_postgres_database(app) else '?'


def init_db(app=None):
    target_app = app or globals().get('_APP')
    if target_app is None:
        return

    conn = get_db_connection(target_app)
    cursor = get_db_cursor(conn, target_app)

    if is_postgres_database(target_app):
        id_type = 'SERIAL PRIMARY KEY'
        created_at_type = 'TIMESTAMP NOT NULL'
    else:
        id_type = 'INTEGER PRIMARY KEY AUTOINCREMENT'
        created_at_type = 'TEXT NOT NULL'

    cursor.execute(f'''
        CREATE TABLE IF NOT EXISTS inquiries (
            id {id_type},
            name TEXT NOT NULL,
            email TEXT,
            phone TEXT,
            message TEXT,
            product TEXT,
            ip_address TEXT,
            user_agent TEXT,
            referrer TEXT,
            created_at {created_at_type}
        )
    ''')
    cursor.execute(f'''
        CREATE TABLE IF NOT EXISTS visits (
            id {id_type},
            visitor_hash TEXT NOT NULL,
            ip_address TEXT,
            user_agent TEXT,
            referrer TEXT,
            accept_language TEXT,
            path TEXT,
            method TEXT,
            created_at {created_at_type}
        )
    ''')
    conn.commit()
    conn.close()


def save_inquiry(app, name, email, phone, message, product):
    conn = get_db_connection(app)
    cursor = get_db_cursor(conn, app)
    placeholders = get_sql_placeholders(app)
    cursor.execute(
        f'''
        INSERT INTO inquiries (name, email, phone, message, product, ip_address, user_agent, referrer, created_at)
        VALUES ({placeholders}, {placeholders}, {placeholders}, {placeholders}, {placeholders}, {placeholders}, {placeholders}, {placeholders}, {placeholders})
        ''',
        (
            name,
            email,
            phone,
            message,
            product,
            request.remote_addr or '',
            request.headers.get('User-Agent', ''),
            request.headers.get('Referer', ''),
            datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        ),
    )
    conn.commit()
    conn.close()


def get_inquiries(app):
    conn = get_db_connection(app)
    cursor = get_db_cursor(conn, app)
    cursor.execute('SELECT * FROM inquiries ORDER BY created_at DESC')
    rows = cursor.fetchall()
    conn.close()
    return rows


def build_visitor_hash():
    raw = f"{request.remote_addr or ''}|{request.headers.get('User-Agent', '')}|{request.headers.get('Accept-Language', '')}"
    return hashlib.sha256(raw.encode('utf-8')).hexdigest()


def record_visit(app):
    path = request.path or '/'
    if path.startswith('/static') or path.startswith('/favicon') or path.startswith('/admin'):
        return
    conn = get_db_connection(app)
    cursor = get_db_cursor(conn, app)
    placeholders = get_sql_placeholders(app)
    cursor.execute(
        f'''
        INSERT INTO visits (visitor_hash, ip_address, user_agent, referrer, accept_language, path, method, created_at)
        VALUES ({placeholders}, {placeholders}, {placeholders}, {placeholders}, {placeholders}, {placeholders}, {placeholders}, {placeholders})
        ''',
        (
            build_visitor_hash(),
            request.remote_addr or '',
            request.headers.get('User-Agent', ''),
            request.headers.get('Referer', ''),
            request.headers.get('Accept-Language', ''),
            path,
            request.method,
            datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        ),
    )
    conn.commit()
    conn.close()


def get_visit_stats(app):
    conn = get_db_connection(app)
    cursor = get_db_cursor(conn, app)
    cursor.execute('SELECT COUNT(*) as count FROM visits')
    total_visits = cursor.fetchone()['count']
    cursor.execute('SELECT COUNT(DISTINCT visitor_hash) as count FROM visits')
    unique_visitors = cursor.fetchone()['count']
    cursor.execute('SELECT * FROM visits ORDER BY created_at DESC LIMIT 20')
    recent_visits = cursor.fetchall()
    conn.close()
    return {
        'total_visits': total_visits,
        'unique_visitors': unique_visitors,
        'recent_visits': recent_visits,
    }


def check_admin_auth():
    if not request.path.startswith('/admin'):
        return True
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Basic '):
        return False
    try:
        encoded = auth_header.split(' ', 1)[1]
        decoded = base64.b64decode(encoded).decode('utf-8')
        username, password = decoded.split(':', 1)
    except Exception:
        return False
    return username == ADMIN_USERNAME and password == ADMIN_PASSWORD


def register_admin_routes(app):
    globals()['_APP'] = app
    init_db(app)

    @app.before_request
    def track_and_authenticate():
        if request.path.startswith('/admin'):
            if not check_admin_auth():
                response = jsonify({'error': 'Unauthorized'}), 401
                response[0].headers['WWW-Authenticate'] = 'Basic realm="Admin Area"'
                return response
        record_visit(app)

    @app.route('/admin')
    def admin_dashboard():
        inquiries = get_inquiries(app)
        stats = get_visit_stats(app)
        return render_template('admin.html', inquiries=inquiries, stats=stats)
