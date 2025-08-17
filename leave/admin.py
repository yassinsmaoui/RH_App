from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import LeaveType, LeaveBalance, LeaveRequest

@admin.register(LeaveType)
class LeaveTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'days_allowed', 'is_paid', 'requires_approval')
    search_fields = ('name',)
    list_filter = ('is_paid', 'requires_approval')

@admin.register(LeaveBalance)
class LeaveBalanceAdmin(admin.ModelAdmin):
    list_display = ('employee', 'leave_type', 'year', 'total_days', 'used_days', 'remaining_days')
    list_filter = ('leave_type', 'year')
    search_fields = ('employee__user__email', 'employee__employee_id')
    readonly_fields = ('used_days', 'remaining_days')

@admin.register(LeaveRequest)
class LeaveRequestAdmin(admin.ModelAdmin):
    list_display = ('employee', 'leave_type', 'start_date', 'end_date', 'status', 'total_days')
    list_filter = ('status', 'leave_type', 'start_date')
    search_fields = ('employee__user__email', 'employee__employee_id')
    date_hierarchy = 'start_date'
    
    fieldsets = (
        (None, {
            'fields': ('employee', 'leave_type', 'status')
        }),
        (_('Leave Period'), {
            'fields': ('start_date', 'end_date', 'total_days')
        }),
        (_('Request Details'), {
            'fields': ('reason', 'attachment')
        }),
        (_('Approval Details'), {
            'fields': ('approved_by', 'rejection_reason')
        }),
    )
    
    readonly_fields = ('total_days',)
    
    def get_readonly_fields(self, request, obj=None):
        if obj and obj.status != 'pending':
            return self.readonly_fields + ('employee', 'leave_type', 'start_date', 'end_date', 'reason')
        return self.readonly_fields
