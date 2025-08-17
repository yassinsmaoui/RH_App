from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import PerformanceCriteria, PerformanceReview, PerformanceScore, Goal

@admin.register(PerformanceCriteria)
class PerformanceCriteriaAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'weight', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name', 'description')

@admin.register(Goal)
class GoalAdmin(admin.ModelAdmin):
    list_display = ('employee', 'title', 'due_date', 'status', 'priority')
    list_filter = ('status', 'priority', 'due_date')
    search_fields = ('employee__user__email', 'title')
    date_hierarchy = 'due_date'

@admin.register(PerformanceReview)
class PerformanceReviewAdmin(admin.ModelAdmin):
    list_display = ('employee', 'reviewer', 'review_type', 'review_period_start', 'review_period_end', 'status', 'overall_score')
    list_filter = ('review_type', 'status')
    search_fields = ('employee__user__email', 'reviewer__user__email')
    date_hierarchy = 'review_period_end'
    
    fieldsets = (
        (None, {
            'fields': ('employee', 'reviewer', 'review_type', 'review_period_start', 'review_period_end')
        }),
        (_('Review Details'), {
            'fields': ('status', 'overall_score')
        })
    )

@admin.register(PerformanceScore)
class PerformanceScoreAdmin(admin.ModelAdmin):
    list_display = ('review', 'criteria', 'score', 'get_weight', 'get_weighted_score')
    list_filter = ('review__status',)
    search_fields = ('review__employee__user__email', 'criteria__name')

    def get_weight(self, obj):
        return obj.criteria.weight
    get_weight.short_description = _('Weight')

    def get_weighted_score(self, obj):
        return obj.score * obj.criteria.weight / 100
    get_weighted_score.short_description = _('Weighted Score')

    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'review', 'review__employee', 'review__employee__user', 'criteria'
        )
