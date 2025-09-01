from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.translation import gettext_lazy as _

class PerformanceCriteria(models.Model):
    CATEGORY_CHOICES = (
        ('technical', 'Technical Skills'),
        ('soft', 'Soft Skills'),
        ('leadership', 'Leadership'),
        ('productivity', 'Productivity'),
    )

    name = models.CharField(max_length=100)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    weight = models.PositiveIntegerField(help_text='Weight in percentage')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _('performance criteria')
        verbose_name_plural = _('performance criterias')

class PerformanceReview(models.Model):
    REVIEW_TYPE_CHOICES = (
        ('quarterly', 'Quarterly'),
        ('semi_annual', 'Semi Annual'),
        ('annual', 'Annual'),
        ('probation', 'Probation'),
    )

    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('in_review', 'In Review'),
        ('completed', 'Completed'),
        ('acknowledged', 'Acknowledged'),
    )

    employee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='performance_reviews')
    reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='reviews_given'
    )
    review_type = models.CharField(max_length=20, choices=REVIEW_TYPE_CHOICES)
    review_period_start = models.DateField()
    review_period_end = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    overall_score = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        null=True,
        blank=True
    )
    summary = models.TextField(blank=True)
    strengths = models.TextField(blank=True)
    areas_for_improvement = models.TextField(blank=True)
    goals_set = models.TextField(blank=True)
    employee_comments = models.TextField(blank=True)
    reviewer_comments = models.TextField(blank=True)
    acknowledgment_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.employee} - {self.review_type} Review ({self.review_period_start} to {self.review_period_end})"

    class Meta:
        verbose_name = _('performance review')
        verbose_name_plural = _('performance reviews')
        ordering = ['-review_period_end', '-created_at']

class PerformanceScore(models.Model):
    review = models.ForeignKey(PerformanceReview, on_delete=models.CASCADE, related_name='scores')
    criteria = models.ForeignKey(PerformanceCriteria, on_delete=models.CASCADE)
    score = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(5)]
    )
    comments = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.review.employee} - {self.criteria.name}: {self.score}"

    class Meta:
        verbose_name = _('performance score')
        verbose_name_plural = _('performance scores')
        unique_together = ['review', 'criteria']

class Goal(models.Model):
    STATUS_CHOICES = (
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )

    PRIORITY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    )

    employee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='goals')
    title = models.CharField(max_length=200)
    description = models.TextField()
    start_date = models.DateField()
    due_date = models.DateField()
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    progress = models.PositiveIntegerField(default=0, validators=[MaxValueValidator(100)])
    review = models.ForeignKey(
        PerformanceReview,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='related_goals'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.employee} - {self.title}"

    class Meta:
        verbose_name = _('goal')
        verbose_name_plural = _('goals')
        ordering = ['-due_date', 'priority']
