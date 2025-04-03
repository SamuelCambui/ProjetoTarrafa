# For more information, please refer to https://aka.ms/vscode-docker-python
FROM python:3.10

#RUN apt-get update && \
#    apt-get install -y build-essential python3-dev libffi-dev

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE=1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Baixe o grpc_health_probe e torne-o executável
RUN apt-get update && apt-get install -y curl \
    && curl -L -o /usr/local/bin/grpc_health_probe https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/v0.4.11/grpc_health_probe-linux-amd64 \
    && chmod +x /usr/local/bin/grpc_health_probe

COPY . /app/backend
COPY requirements.txt .
RUN pip install --no-cache -r requirements.txt