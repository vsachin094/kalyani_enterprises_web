import base64
import hashlib
import os
import sqlite3
from datetime import datetime

from flask import jsonify, render_template, request


ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'sachin')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'ece@SK364')


def get_db_path(app):
    configured_path = app.config.get('DATABASE_PATH')
    if configured_path:
        return configured_path
    os.makedirs(app.instance_path, exist_ok=True)
    return os.path.join(app.instance_path, 'site_admin.db')


def get_db_connection(app):
    conn = sqlite3.connect(get_db_path(app))
    conn.row_factory = sqlite3.Row
    return conn


def init_db(app=None):
    target_app = app or globals().get('_APP')
    if target_app is None:
        return
    conn = get_db_connection(target_app)
    conn.execute('''
        CREATE TABLE IF NOT EXISTS inquiries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT,
            phone TEXT,
            message TEXT,
            product TEXT,
            ip_address TEXT,
            user_agent TEXT,
            referrer TEXT,
            created_at TEXT NOT NULL
        )
    ''')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS visits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            visitor_hash TEXT NOT NULL,
            ip_address TEXT,
            user_agent TEXT,
            referrer TEXT,
            accept_language TEXT,
            path TEXT,
            method TEXT,
            created_at TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()


def save_inquiry(app, name, email, phone, message, product):
    conn = get_db_connection(app)
    conn.execute(
        '''
        INSERT INTO inquiries (name, email, phone, message, product, ip_address, user_agent, referrer, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
    rows = conn.execute('SELECT * FROM inquiries ORDER BY created_at DESC').fetchall()
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
    conn.execute(
        '''
        INSERT INTO visits (visitor_hash, ip_address, user_agent, referrer, accept_language, path, method, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
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
    total_visits = conn.execute('SELECT COUNT(*) as count FROM visits').fetchone()['count']
    unique_visitors = conn.execute('SELECT COUNT(DISTINCT visitor_hash) as count FROM visits').fetchone()['count']
    recent_visits = conn.execute('SELECT * FROM visits ORDER BY created_at DESC LIMIT 20').fetchall()
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
