import unittest

from admin_panel import build_database_url


class DatabaseConfigTests(unittest.TestCase):
    def test_build_database_url_uses_postgres_environment_values(self):
        env = {
            'DB_USER': 'admin',
            'DB_PASSWORD': 'secret-pass',
            'DB_HOST': 'db.example.com',
            'DB_PORT': '5432',
            'DB_NAME': 'ke_data',
        }

        self.assertEqual(
            build_database_url(env),
            'postgresql://admin:secret-pass@db.example.com:5432/ke_data',
        )


if __name__ == '__main__':
    unittest.main()
