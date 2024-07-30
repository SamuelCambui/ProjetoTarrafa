# For more information, please refer to https://aka.ms/vscode-docker-python
FROM python:3.12-slim

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE=1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED=1

WORKDIR /app
COPY . /app

# Install requirements
COPY setup.sh /app/setup.sh
RUN chmod +x setup.sh
RUN ./setup.sh



#RUN chmod +x /app/start-gunicorn-frontend.sh

# Creates a non-root user with an explicit UID and adds permission to access the /app folder
# For more info, please refer to https://aka.ms/vscode-docker-python-configure-containers
#RUN adduser -u 5678 --disabled-password --gecos "" appuser && chown -R appuser /app
#USER appuser


# Define o script como o entrypoint do container
#ENTRYPOINT ["/app/start-gunicorn-frontend.sh"]


# During debugging, this entry point will be overridden. For more information, please refer to https://aka.ms/vscode-docker-python-debug
#CMD ["gunicorn", "--bind", "0.0.0.0:8001", "run:app", "--workers", "4", "--threads", "2", "--timeout", "120"]
#CMD ["gunicorn", "-b 0.0.0.0:8001", "--worker-class", "gevent", "--workers=50", "--timeout", "600", "run:app"]
