# For more information, please refer to https://aka.ms/vscode-docker-python
FROM python:3.10

#RUN apt-get update && \
#    apt-get install -y build-essential python3-dev libffi-dev

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE=1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED=1

# Install requirements
COPY setup.sh .
#COPY run.sh .
RUN chmod +x setup.sh
#RUN chmod +x run.sh
RUN ./setup.sh

WORKDIR /app
COPY . /app/backend

# Creates a non-root user with an explicit UID and adds permission to access the /app folder
# For more info, please refer to https://aka.ms/vscode-docker-python-configure-containers
#RUN adduser -u 5678 --disabled-password --gecos "" appuser && chown -R appuser /app
#USER appuser

#RUN chmod +x /app/backend/start-gunicorn-backend.sh

# Define o script como o entrypoint do container
#ENTRYPOINT ["/app/backend/start-gunicorn-backend.sh"]

# During debugging, this entry point will be overridden. For more information, please refer to https://aka.ms/vscode-docker-python-debug
#CMD ["gunicorn", "--bind", "0.0.0.0:8000", "-k", "uvicorn.workers.UvicornWorker", "app/main:app"]
