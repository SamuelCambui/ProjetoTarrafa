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

# Install requirements
COPY setup.sh /app/setup.sh
#COPY run.sh .
RUN chmod +x setup.sh
#RUN chmod +x run.sh
RUN ./setup.sh


# Creates a non-root user with an explicit UID and adds permission to access the /app folder
# For more info, please refer to https://aka.ms/vscode-docker-python-configure-containers
#RUN adduser -u 5678 --disabled-password --gecos "" appuser && chown -R appuser /app
#USER appuser

#RUN chmod +x /app/backend/start-gunicorn-backend.sh

# Define o script como o entrypoint do container
#ENTRYPOINT ["/app/backend/start-gunicorn-backend.sh"]

# During debugging, this entry point will be overridden. For more information, please refer to https://aka.ms/vscode-docker-python-debug
#CMD ["gunicorn", "--bind", "0.0.0.0:8000", "-k", "uvicorn.workers.UvicornWorker", "app/main:app"]
