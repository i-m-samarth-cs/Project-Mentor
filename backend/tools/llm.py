"""
Thin wrapper around OpenRouter's /chat/completions endpoint.
"""
import httpx
from config import settings

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


class LLMError(Exception):
    """Raised when the OpenRouter API call fails."""


def _friendly_openrouter_error(status_code: int, body: str) -> str:
    if status_code == 402:
        return (
            "OpenRouter payment required: your account has no credits. "
            "Add funds at https://openrouter.ai/settings/credits then try again."
        )
    if status_code == 401:
        return (
            "OpenRouter rejected the API key. "
            "Check OPENROUTER_API_KEY in project-mentor/backend/.env"
        )
    if status_code == 429:
        return "OpenRouter rate limit hit. Wait a minute and try again."
    snippet = body[:200].strip() if body else ""
    return f"OpenRouter error ({status_code}). {snippet}".strip()


def chat(system_prompt: str, user_prompt: str, max_tokens: int = 2000) -> str:
    headers = {
        "Authorization": f"Bearer {settings.openrouter_api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://project-mentor.local",
        "X-Title": "Autonomous Project Mentor",
    }
    payload = {
        "model": settings.model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "max_tokens": max_tokens,
        "temperature": 0.7,
    }
    try:
        with httpx.Client(timeout=120) as client:
            resp = client.post(OPENROUTER_URL, json=payload, headers=headers)
    except httpx.RequestError as e:
        raise LLMError(f"Could not reach OpenRouter: {e}") from e

    if resp.status_code >= 400:
        raise LLMError(_friendly_openrouter_error(resp.status_code, resp.text))

    try:
        return resp.json()["choices"][0]["message"]["content"].strip()
    except (KeyError, IndexError, TypeError) as e:
        raise LLMError("Unexpected response format from OpenRouter.") from e
