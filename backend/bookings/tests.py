from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

from .models import Movie, Show, Booking


class BookingAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username="user1", password="Pass12345!")
        self.user2 = User.objects.create_user(username="user2", password="Pass12345!")
        self.movie = Movie.objects.create(title="Test Movie", duration_minutes=120)
        self.show = Show.objects.create(
            movie=self.movie,
            screen_name="Screen 1",
            date_time="2030-01-01T20:00:00Z",
            total_seats=10,
        )

    def authenticate(self, user):
        self.client.force_authenticate(user=user)

    def test_double_booking_prevention(self):
        self.authenticate(self.user1)
        # First booking succeeds
        res1 = self.client.post(f"/shows/{self.show.id}/book/", {"seat_number": 1}, format="json")
        self.assertEqual(res1.status_code, status.HTTP_201_CREATED)
        # Second booking of the same seat should be prevented
        res2 = self.client.post(f"/shows/{self.show.id}/book/", {"seat_number": 1}, format="json")
        self.assertEqual(res2.status_code, status.HTTP_409_CONFLICT)
        self.assertEqual(res2.data.get("detail"), "Seat already booked")

    def test_seat_range_validation(self):
        self.authenticate(self.user1)
        # Missing seat_number is required
        res_missing = self.client.post(f"/shows/{self.show.id}/book/", {}, format="json")
        self.assertEqual(res_missing.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(res_missing.data.get("detail"), "seat_number is required")
        # Negative seat number invalid
        res_low = self.client.post(f"/shows/{self.show.id}/book/", {"seat_number": -1}, format="json")
        self.assertEqual(res_low.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(res_low.data.get("detail"), "Invalid seat number")
        # Seat number > total_seats invalid
        res_high = self.client.post(f"/shows/{self.show.id}/book/", {"seat_number": 11}, format="json")
        self.assertEqual(res_high.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(res_high.data.get("detail"), "Invalid seat number")

    def test_cancel_ownership_check(self):
        # user1 books a seat
        self.authenticate(self.user1)
        res = self.client.post(f"/shows/{self.show.id}/book/", {"seat_number": 2}, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        booking_id = res.data.get("id")

        # user2 tries to cancel user1's booking
        self.authenticate(self.user2)
        res_cancel = self.client.post(f"/bookings/{booking_id}/cancel/", format="json")
        self.assertEqual(res_cancel.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(res_cancel.data.get("detail"), "Booking not found")

    def test_cancel_frees_seat(self):
        # user1 books a seat
        self.authenticate(self.user1)
        res = self.client.post(f"/shows/{self.show.id}/book/", {"seat_number": 3}, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        booking_id = res.data.get("id")

        # user1 cancels
        res_cancel = self.client.post(f"/bookings/{booking_id}/cancel/", format="json")
        self.assertEqual(res_cancel.status_code, status.HTTP_200_OK)
        self.assertEqual(res_cancel.data.get("detail"), "Booking cancelled")

        # Seat should be available again
        res_book_again = self.client.post(f"/shows/{self.show.id}/book/", {"seat_number": 3}, format="json")
        self.assertEqual(res_book_again.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            Booking.objects.filter(show=self.show, seat_number=3, status=Booking.STATUS_BOOKED).count(),
            1,
        )
