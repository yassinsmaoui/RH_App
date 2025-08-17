from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Employee, Department

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'manager')
    search_fields = ('name', 'code')
    list_filter = ('created_at',)

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('employee_id', 'user', 'department', 'designation', 'employment_status')
    list_filter = ('employment_status', 'employment_type')
    search_fields = ('employee_id', 'user__email', 'work_email')
    date_hierarchy = 'joining_date'
    
    fieldsets = (
        (None, {
            'fields': ('user', 'employee_id', 'department', 'designation', 'employment_status', 'employment_type')
        }),
        (_('Employment Details'), {
            'fields': ('joining_date', 'base_salary', 'bank_account_number', 'bank_name')
        }),
        (_('Contact Information'), {
            'fields': ('work_email', 'emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relation')
        }),
        (_('Personal Information'), {
            'fields': ('birth_date', 'gender', 'marital_status', 'address')
        }),
    )
    
    def get_readonly_fields(self, request, obj=None):
        if obj:  # editing an existing object
            return ('employee_id',) + self.readonly_fields
        return self.readonly_fields
