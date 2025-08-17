from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import PayrollPeriod, PayrollRecord, Allowance, Deduction

@admin.register(PayrollPeriod)
class PayrollPeriodAdmin(admin.ModelAdmin):
    list_display = ('period_type', 'start_date', 'end_date', 'status')
    list_filter = ('period_type', 'status', 'start_date')
    search_fields = ('description',)
    date_hierarchy = 'start_date'

@admin.register(Allowance)
class AllowanceAdmin(admin.ModelAdmin):
    list_display = ('name', 'amount', 'is_taxable', 'is_fixed')
    list_filter = ('is_taxable', 'is_fixed')
    search_fields = ('name', 'description')

@admin.register(Deduction)
class DeductionAdmin(admin.ModelAdmin):
    list_display = ('name', 'amount', 'is_fixed')
    list_filter = ('is_fixed',)
    search_fields = ('name', 'description')

@admin.register(PayrollRecord)
class PayrollRecordAdmin(admin.ModelAdmin):
    list_display = ('employee', 'payroll_period', 'status')
    list_filter = ('status',)
    search_fields = ('employee__user__email', 'employee__employee_id')
    date_hierarchy = 'created_at'
    
    fieldsets = (
        (None, {
            'fields': ('employee', 'payroll_period', 'status')
        }),
        (_('Additional Information'), {
            'fields': ('notes',)
        }),
    )
