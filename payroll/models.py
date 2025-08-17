from django.db import models
from django.core.validators import MinValueValidator
from django.utils.translation import gettext_lazy as _
from employees.models import Employee

class PayrollPeriod(models.Model):
    PERIOD_TYPE_CHOICES = (
        ('monthly', 'Monthly'),
        ('bi_weekly', 'Bi-Weekly'),
        ('weekly', 'Weekly'),
    )

    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )

    period_type = models.CharField(max_length=20, choices=PERIOD_TYPE_CHOICES, default='monthly')
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    processed_by = models.ForeignKey(
        Employee,
        on_delete=models.SET_NULL,
        null=True,
        related_name='processed_payrolls'
    )
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.period_type} Payroll ({self.start_date} to {self.end_date})"

    class Meta:
        verbose_name = _('payroll period')
        verbose_name_plural = _('payroll periods')
        ordering = ['-start_date']

class PayrollRecord(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('paid', 'Paid'),
        ('cancelled', 'Cancelled'),
    )

    payroll_period = models.ForeignKey(PayrollPeriod, on_delete=models.CASCADE, related_name='payroll_records')
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='payroll_records')
    basic_salary = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    overtime_hours = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    overtime_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    overtime_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    allowances = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    net_salary = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_date = models.DateField(null=True, blank=True)
    payment_method = models.CharField(max_length=50, blank=True)
    payment_reference = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Calculate overtime amount
        self.overtime_amount = self.overtime_hours * self.overtime_rate
        
        # Calculate net salary
        self.net_salary = (
            self.basic_salary
            + self.overtime_amount
            + self.allowances
            - self.deductions
            - self.tax
        )
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.employee} - {self.payroll_period}"

    class Meta:
        verbose_name = _('payroll record')
        verbose_name_plural = _('payroll records')
        ordering = ['-created_at']
        unique_together = ['payroll_period', 'employee']

class Allowance(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_taxable = models.BooleanField(default=True)
    is_fixed = models.BooleanField(default=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _('allowance')
        verbose_name_plural = _('allowances')

class Deduction(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_fixed = models.BooleanField(default=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    percentage = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(0)], default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _('deduction')
        verbose_name_plural = _('deductions')
