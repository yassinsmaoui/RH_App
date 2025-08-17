# HR Management System

A modern Human Resources (HR) web application built with Django and React.

## Features

- Employee Management (CRUD operations)
- Role-based Access Control (Admin, HR, Employee)
- Leave and Absence Management
- Attendance Tracking
- Performance Evaluation
- HR Analytics Dashboard
- Email Notifications
- Payroll Management

## Tech Stack

### Backend
- Django
- Django REST Framework
- PostgreSQL
- Celery (for async tasks)
- Redis (for caching)

### Frontend
- React
- Redux Toolkit
- Material-UI
- Chart.js

## Getting Started

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL
- Redis

### Backend Setup
1. Create a virtual environment:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create .env file with following variables:
   ```
   DEBUG=True
   SECRET_KEY=your-secret-key
   DATABASE_URL=postgresql://user:password@localhost:5432/hr_db
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_HOST_USER=your-email@gmail.com
   EMAIL_HOST_PASSWORD=your-app-password
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Create superuser:
   ```bash
   python manage.py createsuperuser
   ```

6. Run development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
hr_app/
├── backend/
│   ├── core/
│   ├── accounts/
│   ├── employees/
│   ├── attendance/
│   ├── leave/
│   ├── performance/
│   ├── payroll/
│   └── notifications/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── features/
│   │   ├── services/
│   │   └── utils/
│   └── public/
└── docs/
```

## API Documentation

API documentation is available at `/api/docs/` when running in development mode.

## License

This project is licensed under the MIT License - see the LICENSE file for details.