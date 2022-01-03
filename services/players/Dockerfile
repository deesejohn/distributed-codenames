FROM python:3.9-slim AS base
ENV PYROOT /pyroot
ENV PYTHONUSERBASE $PYROOT
RUN pip install pipenv

FROM base AS builder
COPY Pipfile Pipfile.lock ./
RUN PIP_USER=1 \
    PIP_IGNORE_INSTALLED=1 \
    pipenv install --system --deploy --ignore-pipfile

FROM builder
ENV PATH="$PYROOT/bin:$PATH"
COPY app/ app/
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]