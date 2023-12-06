FROM python:3.12-slim AS builder
RUN pip install poetry
COPY pyproject.toml poetry.lock ./
RUN poetry install --no-dev --no-interaction --no-ansi --no-root

FROM builder
COPY app/ app/
CMD ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
