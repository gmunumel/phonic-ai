import time
import os
import redis.asyncio as aioredis

from src.log import logger

redis = aioredis.from_url(os.getenv("REDIS_URL"), decode_responses=True)

MAX_RECORDINGS_PER_MINUTE = int(os.getenv("MAX_RECORDINGS_PER_MINUTE", "10"))
MAX_RECORDINGS_PER_HOUR = int(os.getenv("MAX_RECORDINGS_PER_HOUR", "60"))
MAX_RECORDINGS_PER_DAY = int(os.getenv("MAX_RECORDINGS_PER_DAY", "200"))


async def increment_and_check_limits(ip: str | None) -> bool:
    if not ip:
        logger.error("No IP address provided, cannot track limits.")
        return False

    now = int(time.time())
    minute_key = f"recordings:{ip}:minute"
    hour_key = f"recordings:{ip}:hour"
    day_key = f"recordings:{ip}:day"
    last_key = f"recordings:{ip}:last"

    # Redis pipeline for atomicity and performance
    async with redis.pipeline() as pipe:
        # Increment counters and set expiry if new
        pipe.incr(minute_key)
        pipe.expire(minute_key, 60)
        pipe.incr(hour_key)
        pipe.expire(hour_key, 3600)
        pipe.incr(day_key)
        pipe.expire(day_key, 86400)
        pipe.set(last_key, now)
        results = await pipe.execute()

    minute_count = int(await redis.get(minute_key) or 0)
    hour_count = int(await redis.get(hour_key) or 0)
    day_count = int(await redis.get(day_key) or 0)

    if (
        minute_count > MAX_RECORDINGS_PER_MINUTE
        or hour_count > MAX_RECORDINGS_PER_HOUR
        or day_count > MAX_RECORDINGS_PER_DAY
    ):
        return False
    return True
