from django import template
from django.template.defaultfilters import floatformat
from django.utils import timezone
from datetime import datetime, timedelta
from accounts.utils import format_currency, calculate_leave_duration

register = template.Library()

@register.filter
def currency(value, currency_code='USD'):
    """Format a number as currency."""
    try:
        return format_currency(float(value), currency_code)
    except (ValueError, TypeError):
        return value

@register.filter
def percentage(value):
    """Format a number as percentage."""
    try:
        return f"{floatformat(value * 100, 1)}%"
    except (ValueError, TypeError):
        return value

@register.filter
def hours_minutes(hours):
    """Convert decimal hours to hours and minutes format."""
    try:
        hours = float(hours)
        hours_part = int(hours)
        minutes_part = int((hours - hours_part) * 60)
        return f"{hours_part:02d}:{minutes_part:02d}"
    except (ValueError, TypeError):
        return hours

@register.filter
def time_ago(value):
    """Convert datetime to '... time ago' format."""
    if not value:
        return ''

    now = timezone.now()
    try:
        difference = now - value
    except (ValueError, TypeError):
        return value

    if difference.days > 365:
        years = difference.days // 365
        return f"{years} year{'s' if years != 1 else ''} ago"
    elif difference.days > 30:
        months = difference.days // 30
        return f"{months} month{'s' if months != 1 else ''} ago"
    elif difference.days > 0:
        return f"{difference.days} day{'s' if difference.days != 1 else ''} ago"
    elif difference.seconds > 3600:
        hours = difference.seconds // 3600
        return f"{hours} hour{'s' if hours != 1 else ''} ago"
    elif difference.seconds > 60:
        minutes = difference.seconds // 60
        return f"{minutes} minute{'s' if minutes != 1 else ''} ago"
    else:
        return "just now"

@register.filter
def status_color(status):
    """Return Bootstrap color class based on status."""
    status = str(status).lower()
    color_map = {
        'approved': 'success',
        'pending': 'warning',
        'rejected': 'danger',
        'active': 'success',
        'inactive': 'secondary',
        'completed': 'success',
        'in progress': 'info',
        'cancelled': 'danger',
        'on hold': 'warning'
    }
    return color_map.get(status, 'secondary')

@register.simple_tag
def leave_duration(start_date, end_date, exclude_weekends=True):
    """Calculate leave duration between two dates."""
    try:
        return calculate_leave_duration(start_date, end_date, exclude_weekends)
    except (ValueError, TypeError):
        return 0

@register.simple_tag
def fiscal_year():
    """Return current fiscal year."""
    today = timezone.now()
    fiscal_start_month = 4  # April
    
    if today.month < fiscal_start_month:
        return f"{today.year-1}/{today.year}"
    return f"{today.year}/{today.year+1}"

@register.filter
def initials(value):
    """Get initials from a full name."""
    try:
        words = str(value).split()
        return ''.join(word[0].upper() for word in words if word)
    except (ValueError, TypeError, AttributeError):
        return value

@register.filter
def mask_number(value, visible_digits=4):
    """Mask a number/string with asterisks except last few digits."""
    try:
        value = str(value)
        if len(value) <= visible_digits:
            return value
        return '*' * (len(value) - visible_digits) + value[-visible_digits:]
    except (ValueError, TypeError):
        return value

@register.simple_tag
def date_range_text(start_date, end_date):
    """Format a date range as text."""
    try:
        if start_date == end_date:
            return start_date.strftime('%B %d, %Y')
        elif start_date.year == end_date.year:
            if start_date.month == end_date.month:
                return f"{start_date.strftime('%B %d')} - {end_date.strftime('%d, %Y')}"
            return f"{start_date.strftime('%B %d')} - {end_date.strftime('%B %d, %Y')}"
        return f"{start_date.strftime('%B %d, %Y')} - {end_date.strftime('%B %d, %Y')}"
    except (ValueError, TypeError, AttributeError):
        return f"{start_date} - {end_date}"