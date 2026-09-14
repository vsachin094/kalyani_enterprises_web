"""Small JSON configuration loader with environment-variable overrides."""
import json
import os
from pathlib import Path
from typing import Any

CONFIG_FILE = Path(os.getenv("CONFIG_FILE", Path(__file__).with_name("config.json")))


def _read_config() -> dict[str, Any]:
    if not CONFIG_FILE.exists():
        return {}
    with CONFIG_FILE.open("r", encoding="utf-8") as file:
        return json.load(file)


CONFIG = _read_config()


def setting(section: str, key: str, env_name: str, default: Any = None) -> Any:
    value = os.getenv(env_name)
    if value is not None:
        return value
    return CONFIG.get(section, {}).get(key, default)
