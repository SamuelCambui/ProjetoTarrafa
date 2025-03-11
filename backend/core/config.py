from typing import Any, Dict, List, Optional, Union

from pydantic import AnyHttpUrl, EmailStr, HttpUrl, PostgresDsn
from pydantic_settings import BaseSettings

import os

class Settings(BaseSettings):
    #* Project
    API_STR: str = os.getenv('API_STR', '')
    SECRET_KEY: str = "21dcbf197a7cca0f30c4040efb45f8a6bb460c8a80bf40149fa69da6b98b5784"
    # Correção: tempo em segundos (não em minutos)
    # 60 segundos * 60 minutos * 24 horas * 2 dias = 2 dias (172800 segundos)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 60 * 24 * 2
    BACKEND_HOST: str = os.getenv('BACKEND_HOST', '')
    FRONTEND_HOST: str = os.getenv('FRONTEND_HOST', '')
    PROJECT_NAME: str = os.getenv('PROJECT_NAME', '')

    BACKEND_REAL: str = os.getenv('BACKEND_REAL', '')
    FRONTEND_REAL: str = os.getenv('FRONTEND_REAL', '')


    #diretorios
    BARRA: str = os.getenv('BARRA', '')

    #* Redis
    LOCAL_REDIS_URL: str = os.getenv('LOCAL_REDIS_URL', '')
    REDIS_PORT: str = os.getenv('REDIS_PORT', '')


    #* Postgres
    POSTGRES_USER: str= os.getenv('POSTGRES_USER', '')
    POSTGRES_PASSWORD: str= os.getenv('POSTGRES_PASSWORD', '')
    POSTGRES_HOST_2: str= os.getenv('POSTGRES_HOST_2', '')
    POSTGRES_DB_2: str= os.getenv('POSTGRES_DB_2', '')

    #POSTGRES_DB_GRAD: str = os.getenv('POSTGRES_DB_GRAD')
    POSTGRES_DB_GRAD_FORM: str = os.getenv('POSTGRES_DB_GRAD_FORM', '')
    POSTGRES_DB_GRAD: str = os.getenv('POSTGRES_DB_GRAD', '')
    POSTGRES_PORT: str = os.getenv('POSTGRES_PORT', '')
    
    #* Email
    # Senha email tarrafa : #sistema@tarrafa#2024
    SMTP_USER: str = "sistema.tarrafa@gmail.com"
    SMTP_PASSWORD: str = "xdjyfzvaiprolhvr"
    EMAIL_RESET_TOKEN_EXPIRE_HOURS: int = 60 * 30
    EMAIL_TEMPLATES_DIR: str = f"{BARRA}emails_template"

    RABBITMQ_HOST : str = os.getenv('RABBITMQ_HOST', "localhost")
    RABBITMQ_DEFAULT_VHOST : str = os.getenv('RABBITMQ_DEFAULT_VHOST', "vhost")
    RABBITMQ_DEFAULT_USER : str = os.getenv('RABBITMQ_DEFAULT_USER', "guest")
    RABBITMQ_DEFAULT_PASS : str = os.getenv('RABBITMQ_DEFAULT_PASS', "guest")

    GRPC_SERVER_HOST : str = os.getenv('GRPC_SERVER_HOST', "localhost")
    GRPC_SERVER_LOGIN : str =os.getenv('GRPC_SERVER_LOGIN', "localhost")
    GRPC_SERVER_LOGIN_FORM : str =os.getenv('GRPC_SERVER_LOGIN_FORM', "localhost")
    GRPC_SERVER_PPGLS : str = os.getenv('GRPC_SERVER_PPGLS', "localhost:50054")
    
    FILA_TAREFAS_CRITICAS : str = os.getenv('FILA_TAREFAS_CRITICAS', 'tarefas_criticas')
    FILA_TAREFAS_CURRICULOS : str = os.getenv('FILA_TAREFAS_CURRICULOS', 'tarefas_curriculos')
    FILA_PROGRESSOS : str = os.getenv('FILA_PROGRESSOS', 'progressos_tarefas')
    JWT_SECRET_KEY : str = os.getenv('JWT_SECRET_KEY', "")

    class Config:
        case_sensitive = True


settings = Settings()
