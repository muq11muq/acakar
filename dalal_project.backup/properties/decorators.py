import functools
import time

from django.core.cache import cache
from django.http import HttpResponseForbidden


def rate_limit(key_prefix, limit=10, period=60):
    """Simple IP-based rate limiter using Django cache."""

    def decorator(view_func):
        @functools.wraps(view_func)
        def wrapper(request, *args, **kwargs):
            ip = request.META.get('HTTP_X_FORWARDED_FOR', '').split(',')[0].strip()
            if not ip:
                ip = request.META.get('REMOTE_ADDR', 'unknown')
            cache_key = f'ratelimit:{key_prefix}:{ip}'
            data = cache.get(cache_key)
            now = time.time()
            if data is None:
                cache.set(cache_key, {'count': 1, 'start': now}, period)
            else:
                if now - data['start'] > period:
                    cache.set(cache_key, {'count': 1, 'start': now}, period)
                elif data['count'] >= limit:
                    return HttpResponseForbidden('تم تجاوز عدد المحاولات. حاول لاحقاً.')
                else:
                    data['count'] += 1
                    cache.set(cache_key, data, period)
            return view_func(request, *args, **kwargs)

        return wrapper

    return decorator
