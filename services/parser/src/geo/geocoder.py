"""
Геокодирование через Nominatim (OpenStreetMap, бесплатно).

Получает координаты (lat, lng) по названию места.
Nominatim имеет лимит 1 запрос/сек — используй кэш в Redis.

Пример:
    coords = geocode("Москва")
    # -> {"lat": 55.7558, "lng": 37.6173, "type": "city"}
"""

# TODO: Фаза 2 — реализовать
# from geopy.geocoders import Nominatim
# from geopy.extra.rate_limiter import RateLimiter
#
# geolocator = Nominatim(user_agent="newsmap-parser")
# geocode_with_limit = RateLimiter(geolocator.geocode, min_delay_seconds=1)
#
# def geocode(place_name: str) -> dict | None:
#     location = geocode_with_limit(place_name)
#     if location:
#         return {
#             "lat": location.latitude,
#             "lng": location.longitude,
#             "address": location.address,
#         }
#     return None
