from django.urls import path
from .views import MoviesListView, ShowsListView, BookSeatView, CancelBookingView, UserBookingsListView

urlpatterns = [
    path("movies/", MoviesListView.as_view(), name="movies-list"),
    path("movies/<int:movie_id>/shows/", ShowsListView.as_view(), name="shows-list"),
    path("shows/<int:show_id>/book/", BookSeatView.as_view(), name="book-seat"),
    path("bookings/<int:booking_id>/cancel/", CancelBookingView.as_view(), name="cancel-booking"),
    path("my-bookings/", UserBookingsListView.as_view(), name="user-bookings"),
]