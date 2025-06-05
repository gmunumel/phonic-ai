FROM python:3.12-slim

WORKDIR /phonic-ai/backend

COPY backend/pyproject.toml ./
COPY backend/src ./src
COPY ai/ai ./ai
COPY ai/.env ./ai/.env
COPY ai/pyproject.toml ./ai/pyproject.toml

RUN pip install --upgrade pip && pip install "uvicorn[standard]" fastapi redis requests python-dotenv python-multipart

ENV PYTHONPATH=/phonic-ai/ai

CMD ["uvicorn", "src.app:app", "--host", "0.0.0.0", "--port", "8000", "--log-level", "debug"]