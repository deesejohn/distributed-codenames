FROM python:3.10-slim AS builder
COPY pyproject.toml poetry.lock ./
RUN pip install poetry \
  && poetry install --no-dev --no-interaction --no-ansi

FROM builder
COPY app/ app/
CMD ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
