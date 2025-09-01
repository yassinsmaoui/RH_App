from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Department, Position, EmployeeDocument, EmploymentHistory, Education, Skill

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'head', 'is_active')
    search_fields = ('name', 'code')
    list_filter = ('is_active', 'created_at')

@admin.register(Position)
class PositionAdmin(admin.ModelAdmin):
    list_display = ('title', 'department', 'level', 'is_active')
    search_fields = ('title', 'code')
    list_filter = ('level', 'department', 'is_active')

@admin.register(EmployeeDocument)
class EmployeeDocumentAdmin(admin.ModelAdmin):
    list_display = ('name', 'employee', 'document_type', 'is_verified')
    search_fields = ('name', 'employee__email')
    list_filter = ('document_type', 'is_verified')

@admin.register(EmploymentHistory)
class EmploymentHistoryAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'position', 'employee', 'start_date', 'end_date')
    search_fields = ('company_name', 'position', 'employee__email')
    list_filter = ('is_current',)

@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ('degree_type', 'field_of_study', 'institution', 'employee')
    search_fields = ('field_of_study', 'institution', 'employee__email')
    list_filter = ('degree_type', 'is_current')

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'proficiency', 'employee', 'is_verified')
    search_fields = ('name', 'category', 'employee__email')
    list_filter = ('proficiency', 'category', 'is_verified')
