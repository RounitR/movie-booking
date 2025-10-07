from rest_framework import serializers
from .models import Movie, Show, Booking

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ["id", "title", "duration_minutes"]

class ShowSerializer(serializers.ModelSerializer):
    movie = MovieSerializer(read_only=True)
    available_seats = serializers.SerializerMethodField()

    class Meta:
        model = Show
        fields = ["id", "movie", "screen_name", "date_time", "total_seats", "available_seats"]

    def get_available_seats(self, obj: Show) -> int:
        booked_count = Booking.objects.filter(show=obj, status=Booking.STATUS_BOOKED).count()
        remaining = obj.total_seats - booked_count
        return remaining if remaining > 0 else 0

class BookingSerializer(serializers.ModelSerializer):
    show = ShowSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = ["id", "show", "seat_number", "status", "created_at"]


class BookSeatRequestSerializer(serializers.Serializer):
    seat_number = serializers.IntegerField(min_value=1)


class CancelResponseSerializer(serializers.Serializer):
    detail = serializers.CharField()


class ShowDetailSerializer(ShowSerializer):
    booked_seats = serializers.SerializerMethodField()

    class Meta(ShowSerializer.Meta):
        fields = ShowSerializer.Meta.fields + ["booked_seats"]

    def get_booked_seats(self, obj: Show):
        return list(
            Booking.objects.filter(show=obj, status=Booking.STATUS_BOOKED)
            .order_by("seat_number")
            .values_list("seat_number", flat=True)
        )