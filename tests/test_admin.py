import base64
import os
import tempfile
import unittest

from app import app, init_db


class AdminDashboardTests(unittest.TestCase):
    def setUp(self):
        self.temp_db = tempfile.NamedTemporaryFile(suffix='.db', delete=False)
        self.temp_db.close()
        app.config['DATABASE_PATH'] = self.temp_db.name
        init_db()
        self.client = app.test_client()

    def tearDown(self):
        if os.path.exists(self.temp_db.name):
            os.remove(self.temp_db.name)

    def test_admin_requires_auth(self):
        response = self.client.get('/admin')
        self.assertEqual(response.status_code, 401)

    def test_admin_shows_inquiries_and_visit_stats(self):
        auth_header = {
            'Authorization': 'Basic ' + base64.b64encode(b'sachin:ece@SK364').decode('utf-8')
        }

        self.client.post('/submit_inquiry', json={
            'name': 'Jane Doe',
            'email': 'jane@example.com',
            'phone': '9999999999',
            'message': 'Need solar consultation',
            'product': 'Solar Panels'
        })
        self.client.get('/')

        response = self.client.get('/admin', headers=auth_header)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Admin Dashboard', response.data)
        self.assertIn(b'Collected Inquiries', response.data)
        self.assertIn(b'Jane Doe', response.data)


if __name__ == '__main__':
    unittest.main()
