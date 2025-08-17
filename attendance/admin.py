from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Attendance, AttendancePolicy

@admin.register(AttendancePolicy)
class AttendancePolicyAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('employee', 'date', 'check_in', 'check_out', 'attendance_type', 'work_hours')
    list_filter = ('date', 'attendance_type', 'employee__department')
    search_fields = ('employee__user__email', 'employee__employee_id')
    date_hierarchy = 'date'
    
    fieldsets = (
        (None, {
            'fields': ('employee', 'date', 'attendance_type')
        }),
        (_('Time Details'), {
            'fields': ('check_in', 'check_out', 'work_hours', 'overtime_hours')
        }),
        (_('Additional Information'), {
            'fields': ('notes', 'is_approved', 'approved_by')
        }),
    )
    
    readonly_fields = ('work_hours', 'overtime_hours')
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('employee', 'employee__user', 'employee__department')
