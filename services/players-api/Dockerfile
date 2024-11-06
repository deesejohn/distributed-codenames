FROM python:3.13-slim AS builder
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-cache

FROM builder
COPY app/ app/
CMD ["uv", "run", "fastapi", "run", "app/main.py", "--port", "8080"]
