import time
import os
import redis.asyncio as aioredis

from dotenv import load_dotenv

from src.log import logger

load_dotenv()
redis = aioredis.from_url(os.getenv("REDIS_URL"), decode_responses=True)

MAX_RECORDINGS_PER_MINUTE = int(os.getenv("MAX_RECORDINGS_PER_MINUTE", "40"))
MAX_RECORDINGS_PER_HOUR = int(os.getenv("MAX_RECORDINGS_PER_HOUR", "120"))
MAX_RECORDINGS_PER_DAY = int(os.getenv("MAX_RECORDINGS_PER_DAY", "200"))


async def increment_and_check_limits(ip: str | None) -> bool:
    if not ip:
        logger.error("No IP address provided, cannot track limits.")
        return False

    await redis.sadd("visited_ips", ip)  # type: ignore

    now = int(time.time())
    minute_key = f"recordings:{ip}:minute"
    hour_key = f"recordings:{ip}:hour"
    day_key = f"recordings:{ip}:day"
    last_key = f"recordings:{ip}:last"

    # Redis pipeline for atomicity and performance
    async with redis.pipeline() as pipe:
        # Increment counters and set expiry if new
        await pipe.incr(minute_key)
        await pipe.expire(minute_key, 60)
        await pipe.incr(hour_key)
        await pipe.expire(hour_key, 3600)
        await pipe.incr(day_key)
        await pipe.expire(day_key, 86400)
        await pipe.set(last_key, now)
        _results = await pipe.execute()

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
