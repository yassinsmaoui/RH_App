# 🏢 HR Management System - Enterprise Edition

A comprehensive, modern Human Resources Management System built with Django REST Framework and React. This production-ready application provides complete HR functionality with enterprise-grade security, scalability, and user experience.

![Django](https://img.shields.io/badge/Django-5.0-green)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![Redis](https://img.shields.io/badge/Redis-7-red)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🚀 Features

### Core Modules

#### 👥 Employee Management
- Complete employee lifecycle management (onboarding → career progression → offboarding)
- Personal & professional information tracking
- Document management with secure storage
- Employment history and education records
- Skills and competency tracking
- Organizational hierarchy visualization

#### 🔐 Authentication & Security
- JWT-based authentication with refresh tokens
- Role-Based Access Control (RBAC)
- Two-factor authentication (2FA)
- Single Sign-On (SSO) with Google/Microsoft
- Session management and audit trails
- GDPR-compliant data handling

#### 📅 Leave & Absence Management
- Multiple leave types configuration
- Approval workflow with multi-level hierarchy
- Leave balance tracking and carry-forward
- Holiday calendar integration
- Absence analytics and reporting
- Team calendar view

#### ⏰ Time & Attendance
- Check-in/check-out system
- Biometric device integration support
- Shift scheduling and roster management
- Overtime calculation
- Geofencing and location tracking
- Real-time attendance dashboard

#### 💰 Payroll Management
- Automated salary calculation
- Tax computation and deductions
- Bonus and incentive management
- Payslip generation (PDF)
- Bank integration for payments
- Compliance reporting

#### 📊 Performance Management
- OKR/KPI goal setting
- 360° feedback system
- Performance review cycles
- Competency assessments
- Career development planning
- Performance analytics

#### 🎯 Recruitment (ATS)
- Job posting management
- Application tracking
- Resume parsing and scoring
- Interview scheduling
- Candidate evaluation workflow
- Onboarding automation

#### 📚 Training & Development
- Course catalog management
- Learning paths and certifications
- Training attendance tracking
- Skill gap analysis
- E-learning integration
- Training effectiveness metrics

## 🛠️ Technology Stack

### Backend
- **Framework**: Django 5.0 with Django REST Framework
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **Task Queue**: Celery with Redis broker
- **WebSocket**: Django Channels
- **File Storage**: AWS S3 / Local storage
- **Authentication**: JWT with Simple JWT

### Frontend
- **Framework**: React 19 with TypeScript
- **State Management**: Redux Toolkit with RTK Query
- **UI Library**: Material-UI v7
- **Charts**: Chart.js, Recharts
- **Forms**: Formik with Yup validation
- **Build Tool**: Vite
- **Testing**: Vitest, React Testing Library

### DevOps & Infrastructure
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions / GitLab CI
- **Monitoring**: Sentry, Prometheus, Grafana
- **Logging**: ELK Stack
- **API Documentation**: Swagger/OpenAPI

## 📋 Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 16+
- Redis 7+
- Git

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/hr-management-system.git
cd hr-management-system
```

### 2. Backend Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Load sample data (optional)
python manage.py loaddata fixtures/sample_data.json

# Start development server
python manage.py runserver
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

### 4. Start Celery Workers (for async tasks)

```bash
# In a new terminal
celery -A backend worker -l info

# In another terminal (for scheduled tasks)
celery -A backend beat -l info
```

## 🐳 Docker Setup

```bash
# Build and start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# Admin Panel: http://localhost:8000/admin
```

## 📁 Project Structure

```
hr-management-system/
├── backend/                # Django backend
│   ├── accounts/          # User management
│   ├── employees/         # Employee module
│   ├── attendance/        # Attendance tracking
│   ├── leave/            # Leave management
│   ├── payroll/          # Payroll processing
│   ├── performance/      # Performance management
│   ├── recruitment/      # ATS module
│   ├── training/         # L&D module
│   └── notifications/    # Notification system
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── store/       # Redux store
│   │   ├── api/         # API integration
│   │   ├── utils/       # Utility functions
│   │   └── assets/      # Static assets
│   └── public/
├── docker/               # Docker configurations
├── docs/                 # Documentation
├── scripts/              # Utility scripts
└── tests/               # Test suites
```

## 🔧 Configuration

### Environment Variables

Key environment variables to configure:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/hr_db

# Redis
REDIS_URL=redis://localhost:6379/0

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# AWS S3 (optional)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_STORAGE_BUCKET_NAME=your-bucket

# Security
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret

# Frontend
VITE_API_URL=http://localhost:8000/api
```

## 📊 API Documentation

API documentation is available at:
- Swagger UI: `http://localhost:8000/api/docs/`
- ReDoc: `http://localhost:8000/api/redoc/`

## 🧪 Testing

### Backend Tests
```bash
# Run all tests
python manage.py test

# With coverage
pytest --cov=. --cov-report=html

# Specific app
python manage.py test employees
```

### Frontend Tests
```bash
# Run tests
npm test

# With coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

## 📈 Performance Optimization

- Database indexing on frequently queried fields
- Redis caching for session and frequently accessed data
- Lazy loading and code splitting in frontend
- Image optimization and CDN integration
- Query optimization with select_related and prefetch_related
- Pagination and infinite scrolling

## 🔒 Security Features

- JWT with refresh token rotation
- Rate limiting on API endpoints
- SQL injection protection
- XSS and CSRF protection
- Input validation and sanitization
- Encrypted sensitive data storage
- Regular security audits
- GDPR compliance tools

## 🌍 Internationalization

The application supports multiple languages:
- English (default)
- French
- Spanish
- German
- Arabic

## 📱 Mobile Support

- Fully responsive design
- Progressive Web App (PWA) capabilities
- Mobile app (React Native) - coming soon

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Project Lead**: Your Name
- **Backend Development**: Backend Team
- **Frontend Development**: Frontend Team
- **UI/UX Design**: Design Team
- **DevOps**: Infrastructure Team

## 📞 Support

For support, email support@hrms.com or join our Slack channel.

## 🙏 Acknowledgments

- Django Software Foundation
- React Team at Meta
- All open-source contributors

---

**Built with ❤️ by Your Company**
