FROM python:3.9-slim

# Install build dependencies
RUN apt-get update \
    && apt-get install -y \
        build-essential \
        default-libmysqlclient-dev \
        pkg-config \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy the application code and requirements file to the container
COPY server /app
COPY server/run.py /app/run.py
COPY server/config.py /app/
COPY server/requirements.txt /app/requirements.txt

# Install Python dependencies
RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Define environment variables
ENV FLASK_ENV=development \
    FLASK_APP=run.py

# Expose the port on which the Flask app will run
EXPOSE 5000

# Command to run the Flask application
CMD ["flask", "run", "--host", "0.0.0.0", "--port", "5000"]
