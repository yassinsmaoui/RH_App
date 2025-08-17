import os
import uuid
from datetime import datetime, timedelta
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.utils import timezone

def generate_employee_id():
    """Generate a unique employee ID with prefix 'EMP' and current year."""
    year = datetime.now().year
    random_id = str(uuid.uuid4().int)[:6]
    return f'EMP{year}{random_id}'

def calculate_leave_duration(start_date, end_date, exclude_weekends=True):
    """Calculate the duration of leave in days, optionally excluding weekends."""
    if not isinstance(start_date, datetime):
        start_date = datetime.combine(start_date, datetime.min.time())
    if not isinstance(end_date, datetime):
        end_date = datetime.combine(end_date, datetime.min.time())
    
    duration = 0
    current_date = start_date
    
    while current_date <= end_date:
        if not exclude_weekends or current_date.weekday() < 5:  # 0-4 represents Monday to Friday
            duration += 1
        current_date += timedelta(days=1)
    
    return duration

def calculate_work_hours(check_in, check_out):
    """Calculate total work hours between check-in and check-out times."""
    if not check_in or not check_out:
        return 0
    
    duration = check_out - check_in
    hours = duration.total_seconds() / 3600  # Convert seconds to hours
    return round(hours, 2)

def calculate_overtime_hours(work_hours, standard_hours=8):
    """Calculate overtime hours based on standard working hours."""
    if work_hours <= standard_hours:
        return 0
    return round(work_hours - standard_hours, 2)

def calculate_net_salary(basic_salary, allowances, deductions):
    """Calculate net salary after adding allowances and subtracting deductions."""
    total_allowances = sum(allowance.amount for allowance in allowances)
    total_deductions = sum(deduction.amount for deduction in deductions)
    return basic_salary + total_allowances - total_deductions

def send_email_notification(subject, template_name, context, recipient_list, from_email=None):
    """Send HTML email using templates."""
    if from_email is None:
        from_email = settings.DEFAULT_FROM_EMAIL

    # Render HTML content
    html_content = render_to_string(template_name, context)
    text_content = strip_tags(html_content)

    msg = EmailMultiAlternatives(subject, text_content, from_email, recipient_list)
    msg.attach_alternative(html_content, "text/html")
    
    try:
        msg.send()
        return True
    except Exception as e:
        # Log the error
        print(f"Error sending email: {str(e)}")
        return False

def handle_uploaded_file(uploaded_file, directory='documents'):
    """Handle file upload and return the file path."""
    # Generate unique filename
    filename = f"{uuid.uuid4()}_{uploaded_file.name}"
    
    # Create directory if it doesn't exist
    upload_path = os.path.join(settings.MEDIA_ROOT, directory)
    os.makedirs(upload_path, exist_ok=True)
    
    # Save file
    file_path = os.path.join(upload_path, filename)
    with open(file_path, 'wb+') as destination:
        for chunk in uploaded_file.chunks():
            destination.write(chunk)
    
    # Return relative path from MEDIA_ROOT
    return os.path.join(directory, filename)

def format_currency(amount, currency='USD'):
    """Format currency amount with symbol."""
    currency_symbols = {
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        # Add more currencies as needed
    }
    
    symbol = currency_symbols.get(currency, currency)
    return f"{symbol}{amount:,.2f}"

def get_date_range_from_period(period_type, date=None):
    """Get date range for different period types (monthly, weekly, etc.)."""
    if date is None:
        date = timezone.now().date()

    if period_type == 'MONTHLY':
        start_date = date.replace(day=1)
        if date.month == 12:
            end_date = date.replace(year=date.year + 1, month=1, day=1) - timedelta(days=1)
        else:
            end_date = date.replace(month=date.month + 1, day=1) - timedelta(days=1)
    
    elif period_type == 'WEEKLY':
        start_date = date - timedelta(days=date.weekday())
        end_date = start_date + timedelta(days=6)
    
    elif period_type == 'BIWEEKLY':
        start_date = date - timedelta(days=date.weekday())
        end_date = start_date + timedelta(days=13)
    
    else:  # Default to daily
        start_date = date
        end_date = date
    
    return start_date, end_date