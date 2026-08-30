FROM python:3.12-slim

WORKDIR /app

# System dependencies for WeasyPrint PDF rendering
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libgdk-pixbuf2.0-0 \
    libffi-dev \
    libcairo2 \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY apps/api/pyproject.toml ./apps/api/
RUN pip install --no-cache-dir -e ./apps/api

# Copy shared database package
COPY packages/database ./packages/database

# Copy application source
COPY apps/api/src ./apps/api/src

ENV PYTHONPATH="/app/packages/database:/app/apps/api"

EXPOSE 8000

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
