from django.core.management.base import BaseCommand
from bookings.models import Movie, Show
from django.utils import timezone

class Command(BaseCommand):
    help = "Seed demo movies and shows"

    def handle(self, *args, **options):
        Movie.objects.all().delete()
        Show.objects.all().delete()

        m1 = Movie.objects.create(title="Inception", duration_minutes=148)
        m2 = Movie.objects.create(title="Interstellar", duration_minutes=169)

        Show.objects.create(movie=m1, screen_name="Screen 1", date_time=timezone.now(), total_seats=10)
        Show.objects.create(movie=m1, screen_name="Screen 2", date_time=timezone.now(), total_seats=8)
        Show.objects.create(movie=m2, screen_name="Screen 1", date_time=timezone.now(), total_seats=12)

        self.stdout.write(self.style.SUCCESS("Seeded demo movies and shows"))