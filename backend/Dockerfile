FROM python:3.12-slim

WORKDIR /app

# copy only requirements first for better caching
COPY requirements.txt ./
RUN python -m pip install --no-cache-dir -r requirements.txt

COPY . /app

ENV PYTHONUNBUFFERED=1
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
