from django.db import models
from django.conf import settings
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

class Attendance(models.Model):
    ATTENDANCE_TYPE_CHOICES = (
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('half_day', 'Half Day'),
        ('work_from_home', 'Work From Home'),
    )

    employee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='attendances')
    date = models.DateField(default=timezone.now)
    check_in = models.DateTimeField(null=True, blank=True)
    check_out = models.DateTimeField(null=True, blank=True)
    attendance_type = models.CharField(max_length=20, choices=ATTENDANCE_TYPE_CHOICES, default='present')
    work_hours = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    overtime_hours = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    notes = models.TextField(blank=True)
    is_approved = models.BooleanField(default=False)
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_attendances'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self.check_in and self.check_out:
            # Calculate work hours
            time_diff = self.check_out - self.check_in
            hours = time_diff.total_seconds() / 3600  # Convert to hours
            self.work_hours = round(hours, 2)
            
            # Calculate overtime (assuming 8-hour workday)
            if hours > 8:
                self.overtime_hours = round(hours - 8, 2)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.employee} - {self.date}"

    class Meta:
        verbose_name = _('attendance')
        verbose_name_plural = _('attendances')
        ordering = ['-date', '-check_in']
        unique_together = ['employee', 'date']

class AttendancePolicy(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    work_start_time = models.TimeField()
    work_end_time = models.TimeField()
    grace_period_minutes = models.IntegerField(default=15)
    minimum_work_hours = models.DecimalField(max_digits=4, decimal_places=2, default=8.00)
    overtime_threshold_hours = models.DecimalField(max_digits=4, decimal_places=2, default=8.00)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _('attendance policy')
        verbose_name_plural = _('attendance policies')
        ordering = ['-created_at']
