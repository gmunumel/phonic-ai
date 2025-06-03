from unittest.mock import AsyncMock
import pytest

from src.api.websocket import get_by_key, broadcast_message, ACTIVE_CONNECTIONS


def test_websocket_get_by_key_valid_json():
    msg = '{"xId": "abc123", "foo": "bar"}'
    assert get_by_key(msg, "xId") == "abc123"
    assert get_by_key(msg, "foo") == "bar"


def test_websocket_get_by_key_missing_key():
    msg = '{"foo": "bar"}'
    assert get_by_key(msg, "xId") is None


def test_websocket_get_by_key_invalid_json():
    msg = "{not a valid json}"
    assert get_by_key(msg, "xId") is None


@pytest.mark.asyncio
async def test_websocket_broadcast_message_removes_disconnected():
    # Setup: two mock connections, one will raise, one will not
    good_conn = AsyncMock()
    bad_conn = AsyncMock()
    bad_conn.send_json.side_effect = RuntimeError("fail")
    ACTIVE_CONNECTIONS.clear()
    ACTIVE_CONNECTIONS.extend([good_conn, bad_conn])

    await broadcast_message({"foo": "bar"}, delay=0)

    # good_conn should still be in ACTIVE_CONNECTIONS, bad_conn removed
    assert good_conn in ACTIVE_CONNECTIONS
    assert bad_conn not in ACTIVE_CONNECTIONS
    good_conn.send_json.assert_called_once_with({"foo": "bar"})
    bad_conn.send_json.assert_called_once_with({"foo": "bar"})
