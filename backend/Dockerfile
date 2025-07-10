# Use official Python image
FROM python:3.11-slim

# Set env vars
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install dependencies
COPY backend/requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy project files
COPY backend/ .

# Set environment variable for Django
ENV DJANGO_SETTINGS_MODULE=mind_for_minds.settings

EXPOSE $PORT

# Start server (use gunicorn or Django dev server)
CMD exec gunicorn mind_for_minds.wsgi:application --bind :$PORT
