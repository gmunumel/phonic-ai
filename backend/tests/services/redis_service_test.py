from unittest.mock import AsyncMock, MagicMock, patch
from dotenv import load_dotenv
import pytest

from src.services import redis_service

load_dotenv()


@pytest.mark.asyncio
async def test_redis_service_increment_and_check_limits_allows_when_under_limits():
    mock_redis = MagicMock()
    mock_pipe = AsyncMock()
    mock_pipe.execute = AsyncMock()
    mock_redis.pipeline.return_value.__aenter__.return_value = mock_pipe
    mock_redis.pipeline.return_value.__aexit__.return_value = False
    mock_redis.sadd = AsyncMock()
    mock_redis.get = AsyncMock(side_effect=["1", "2", "3"])

    with patch.object(redis_service, "redis", mock_redis):
        allowed = await redis_service.increment_and_check_limits("127.0.0.1")
        assert allowed is True
        assert mock_pipe.incr.call_count == 3
        assert mock_pipe.expire.call_count == 3
        assert mock_pipe.set.call_count == 1
        mock_pipe.execute.assert_awaited_once()


@pytest.mark.asyncio
async def test_redis_service_increment_and_check_limits_blocks_when_over_limit():
    mock_redis = MagicMock()
    mock_pipe = AsyncMock()
    mock_pipe.execute = AsyncMock()
    mock_redis.pipeline.return_value.__aenter__.return_value = mock_pipe
    mock_redis.pipeline.return_value.__aexit__.return_value = False
    mock_redis.sadd = AsyncMock()
    # Simulate minute_count over the limit
    mock_redis.get = AsyncMock(
        side_effect=[str(redis_service.MAX_RECORDINGS_PER_MINUTE + 1), "0", "0"]
    )

    with patch.object(redis_service, "redis", mock_redis):
        allowed = await redis_service.increment_and_check_limits("127.0.0.1")
        assert allowed is False


@pytest.mark.asyncio
async def test_redis_service_increment_and_check_limits_no_ip():
    allowed = await redis_service.increment_and_check_limits(None)
    assert allowed is False
