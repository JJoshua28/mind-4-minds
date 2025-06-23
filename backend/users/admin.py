from django.contrib import admin
from .models import UserDetails, MenteeDetails, MentorDetails, MenteeMentorLink

admin.site.register(UserDetails)
admin.site.register(MenteeDetails)
admin.site.register(MentorDetails)
admin.site.register(MenteeMentorLink)
