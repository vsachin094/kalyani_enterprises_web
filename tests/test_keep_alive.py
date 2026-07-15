import unittest

from app import get_keep_alive_config


class KeepAliveConfigTests(unittest.TestCase):
    def test_defaults_to_render_keep_alive(self):
        config = get_keep_alive_config({'RENDER': '1'})
        self.assertTrue(config['enabled'])
        self.assertEqual(config['url'], 'https://www.kalyanienterprises.com/')
        self.assertEqual(config['interval_minutes'], 5)

    def test_can_override_keep_alive_settings(self):
        config = get_keep_alive_config({
            'KEEP_ALIVE_ENABLED': 'false',
            'KEEP_ALIVE_URL': 'https://example.com/health',
            'KEEP_ALIVE_INTERVAL_MINUTES': '2',
        })
        self.assertFalse(config['enabled'])
        self.assertEqual(config['url'], 'https://example.com/health')
        self.assertEqual(config['interval_minutes'], 2)


if __name__ == '__main__':
    unittest.main()
