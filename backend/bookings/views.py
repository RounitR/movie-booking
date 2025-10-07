from django.db import transaction
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiParameter

from .models import Movie, Show, Booking
from .serializers import MovieSerializer, ShowSerializer, BookingSerializer, BookSeatRequestSerializer

class MoviesListView(generics.ListAPIView):
    queryset = Movie.objects.all().order_by("title")
    serializer_class = MovieSerializer
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        tags=["Bookings"],
        summary="List movies",
        responses=MovieSerializer(many=True),
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

class ShowsListView(generics.ListAPIView):
    serializer_class = ShowSerializer
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        tags=["Bookings"],
        summary="List shows for a movie",
        parameters=[
            OpenApiParameter(
                name="movie_id",
                description="ID of the movie",
                required=True,
                type=int,
                location=OpenApiParameter.PATH,
            ),
        ],
        responses=ShowSerializer(many=True),
    )
    def get_queryset(self):
        movie_id = self.kwargs.get("movie_id")
        qs = Show.objects.all().select_related("movie").order_by("date_time")
        if movie_id:
            qs = qs.filter(movie_id=movie_id)
        return qs

class BookSeatView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        tags=["Bookings"],
        summary="Book a seat for a show",
        parameters=[
            OpenApiParameter(
                name="show_id",
                description="ID of the show",
                required=True,
                type=int,
                location=OpenApiParameter.PATH,
            ),
        ],
        request=BookSeatRequestSerializer,
        responses=BookingSerializer,
        examples=[
            OpenApiExample("Book seat", value={"seat_number": 5}, request_only=True),
        ],
    )
    def post(self, request, show_id):
        seat_number = request.data.get("seat_number")
        if not seat_number:
            return Response({"detail": "seat_number is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            seat_number = int(seat_number)
        except ValueError:
            return Response({"detail": "seat_number must be an integer"}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            try:
                show = Show.objects.select_for_update().get(id=show_id)
            except Show.DoesNotExist:
                return Response({"detail": "Show not found"}, status=status.HTTP_404_NOT_FOUND)

            if seat_number < 1 or seat_number > show.total_seats:
                return Response({"detail": "Invalid seat number"}, status=status.HTTP_400_BAD_REQUEST)

            existing = Booking.objects.select_for_update().filter(
                show=show, seat_number=seat_number, status=Booking.STATUS_BOOKED
            ).first()
            if existing:
                return Response({"detail": "Seat already booked"}, status=status.HTTP_409_CONFLICT)

            booking = Booking.objects.create(
                user=request.user,
                show=show,
                seat_number=seat_number,
                status=Booking.STATUS_BOOKED,
            )
            return Response(BookingSerializer(booking).data, status=status.HTTP_201_CREATED)

class CancelBookingView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        tags=["Bookings"],
        summary="Cancel a booking",
        parameters=[
            OpenApiParameter(
                name="booking_id",
                description="ID of the booking",
                required=True,
                type=int,
                location=OpenApiParameter.PATH,
            ),
        ],
        responses={200: OpenApiExample("Cancel success", value={"detail": "Booking cancelled"})},
    )
    def post(self, request, booking_id):
        with transaction.atomic():
            try:
                booking = Booking.objects.select_for_update().get(id=booking_id, user=request.user)
            except Booking.DoesNotExist:
                return Response({"detail": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)

            if booking.status == Booking.STATUS_CANCELLED:
                return Response({"detail": "Booking already cancelled"}, status=status.HTTP_400_BAD_REQUEST)
            booking.status = Booking.STATUS_CANCELLED
            booking.save(update_fields=["status"])
            return Response({"detail": "Booking cancelled"}, status=status.HTTP_200_OK)

class UserBookingsListView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        tags=["Bookings"],
        summary="List current user's bookings",
        responses=BookingSerializer(many=True),
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user).select_related("show", "show__movie").order_by("-created_at")
