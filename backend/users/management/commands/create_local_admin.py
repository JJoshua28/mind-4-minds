import uuid
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from users.models import UserDetails, UserType

class Command(BaseCommand):
    help = "Create a local admin user with linked UserDetails"

    def add_arguments(self, parser):
        parser.add_argument(
            "--email",
            type=str,
            default="admin@admin.com",
            help="Email of the admin user (default: admin@local.dev)"
        )
        parser.add_argument(
            "--password",
            type=str,
            default="admin@123",
            help="Password for the admin user (default: admin123)"
        )
        parser.add_argument(
            "--first-name",
            type=str,
            default="admin",
            help="First name of the admin user"
        )
        parser.add_argument(
            "--last-name",
            type=str,
            default="admin",
            help="Last name of the admin user"
        )

    def handle(self, *args, **options):
        User = get_user_model()
        email = options["email"]
        password = options["password"]
        first_name = options["first_name"]
        last_name = options["last_name"]

        # Check if user exists
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "is_staff": True,
                "is_superuser": False,
                "is_active": True,
            },
        )

        if created:
            user.set_password(password)
            user.save()
            self.stdout.write(self.style.SUCCESS(f"✅ Created admin user: {email}"))
        else:
            self.stdout.write(self.style.WARNING(f"⚠️ User already exists: {email}"))

        # Link with UserDetails
        details, details_created = UserDetails.objects.get_or_create(
            user=user,
            defaults={
                "first_name": first_name,
                "last_name": last_name,
                "roles": ["admin"],
            }
        )

        if details_created:
            self.stdout.write(self.style.SUCCESS("✅ Linked UserDetails created"))
        else:
            self.stdout.write(self.style.WARNING("⚠️ UserDetails already exists"))

