# Kalyani Enterprises Website

A modern website for Kalyani Enterprises, a power and energy solutions provider in Jharkhand, India.

## Project Structure

```
ke-react-python/
├── backend/          # FastAPI Python backend
│   └── seed-data/     # Project-owned JSON content used by the database seeder
├── frontend/         # React + Vite frontend
├── deploy/           # Deployment configs (Dockerfile, nginx, systemd)
├── data/             # JSON data files (products, services, testimonials, etc.)
├── Dockerfile        # Multi-stage Docker build
├── render.yaml       # Render.com deployment config
└── README.md         # This file
```

## Backend (FastAPI)

The Python backend is built with FastAPI and provides:

- **Product API**: `/api/products/` - CRUD operations for product catalogue
- **Service API**: `/api/services/` - CRUD operations for service descriptions
- **Feedback API**: `/api/feedback/` - Submit and review customer feedback
- **Query API**: `/api/queries/` - Customer enquiry submissions
- **Analytics API**: `/api/analytics/` - Page visit tracking
- **Admin API**: `/admin/` - Authentication and management endpoints

### API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/products/` | Product catalogue management |
| `/api/services/` | Service descriptions and processes |
| `/api/feedback/` | Customer feedback submission and review |
| `/api/queries/` | Customer enquiry submissions |
| `/api/analytics/` | Page visit tracking |
| `/admin/login/` | Admin authentication |
| `/admin/feedback/` | Feedback review dashboard |
| `/admin/queries/` | Enquiry review dashboard |
| `/admin/analytics/` | Visit analytics dashboard |

### Running the Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

Production requires `DATABASE_URL`, `SECRET_KEY`, `ADMIN_USERNAME`,
`ADMIN_PASSWORD`, `APP_ENV=production`, `CORS_ORIGINS`, and `ALLOWED_HOSTS`.
Run `python seed_data.py` once after configuring the database. Do not use the
development admin password or JWT secret in production.

For PostgreSQL, the host, port, database name, and username can be kept in
`backend/config.json`; set only `DATABASE_PASSWORD` in `.env`. You can also
provide a complete `DATABASE_URL` instead. See `.env.example` for both forms.
If PostgreSQL is unavailable, the backend falls back to SQLite in
`backend/data/database.db` by default. Set `DATABASE_FALLBACK_TO_SQLITE=false`
to make PostgreSQL failure stop application startup instead.

## Frontend (React + Vite)

The React frontend is built with Vite and provides:

- **Homepage**: Hero section with products and services
- **Products**: Product catalogue with filtering and detail pages
- **Services**: Service catalogue with detail pages
- **Portfolio**: Project showcase
- **Testimonials**: Customer feedback display
- **Contact**: Contact form and information
- **Pages**: FAQs, Privacy Policy, Terms of Service, Warranty, Careers

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Building for Production

```bash
cd frontend
npm run build
```

The build output is placed in `frontend/dist/` and served by the backend or nginx.

## Deployment

### Native VPS deployment (Python + systemd + nginx)

Build the React app and copy the project to `/opt/kalyani-enterprises`:

```bash
cd /path/to/ke-react-python
(cd frontend && npm ci && npm run build)
sudo mkdir -p /opt/kalyani-enterprises
sudo cp -r . /opt/kalyani-enterprises/
sudo useradd --system --home /opt/kalyani-enterprises --shell /usr/sbin/nologin kalyani
sudo -u kalyani python3 -m venv /opt/kalyani-enterprises/backend/.venv
sudo /opt/kalyani-enterprises/backend/.venv/bin/pip install -r /opt/kalyani-enterprises/backend/requirements.txt
sudo mkdir -p /opt/kalyani-enterprises/backend/data
sudo chown -R kalyani:kalyani /opt/kalyani-enterprises
```

Create `/opt/kalyani-enterprises/.env` with production secrets and host values,
then seed the database as the `kalyani` user:

```bash
sudo -u kalyani bash -lc 'cd /opt/kalyani-enterprises/backend && .venv/bin/python seed_data.py'
sudo cp deploy/kalyani-enterprises.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now kalyani-enterprises
```

Install nginx, copy `deploy/nginx.conf` to
`/etc/nginx/sites-available/kalyani-enterprises`, enable it, then run
`sudo certbot --nginx` for HTTPS.

Docker remains available as an optional alternative through `Dockerfile`.

### Render.com

1. Connect your GitHub repository
2. Set the build command from `render.yaml`
3. Add environment variables (DATABASE_URL, SECRET_KEY) as secrets
4. Deploy

### Systemd (VPS)

```bash
cp deploy/kalyani-enterprises.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable kalyani-enterprises
systemctl start kalyani-enterprises
```

## Data Structure

### Products

Products are stored in `backend/seed-data/products/*.json` and include:
- id, name, image, gallery
- short_description, full_description
- features (array)
- specifications (object)
- availability
- related_products (array of IDs)
- benefits (array)

### Services

Services are stored in `backend/seed-data/services/*.json` and include:
- id, name, image, gallery
- short_description, full_description
- features (array)
- duration, service_areas
- process (array of steps)
- included_services (array)
- warranty information

### Feedback

Feedback submissions are stored in the database with:
- id, name, location, text, rating, project_type
- status (pending, approved, rejected)
- createdAt timestamp

### Portfolio

Projects are stored in `backend/seed-data/portfolio.json` and include:
- id, title, description, image, category
- features (array)

### Brand Logos

Brand logos are stored in `backend/seed-data/brand-logos.json` and include:
- id, name, image, website, category

## Content Guide

See `CONTENT_GUIDE.md` for detailed instructions on adding and managing content.

## License

MIT
