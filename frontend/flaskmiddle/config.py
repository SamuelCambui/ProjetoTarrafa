import os

class Config(object):
    DEBUG = os.getenv('DEBUG')

    API_STR = os.getenv('API_STR')
    
    #FASTAPI_URL = os.getenv('BACKEND_HOST')
    GRPC_SERVER_HOST = os.getenv('GRPC_SERVER_HOST')
    GRPC_SERVER_GRAD = os.getenv('GRPC_SERVER_GRAD')
    GRPC_SERVER_PPGLS = os.getenv('GRPC_SERVER_PPGLS')
    FRONTEND_HOST = os.getenv('FRONTEND_HOST')
    FRONTEND = os.getenv('FRONTEND')
    FRONTEND_PORT = os.getenv('FRONTEND_PORT')
    SECRET_KEY =  '$2b$12$J3xn6CTEmH7ht8ZEjBuze.'
    SESSION_PERMANENT = False
    SESSION_TYPE = 'filesystem'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024 

    THREADS_PER_PAGE = 2
    CSRF_ENABLED     = True
    CSRF_SESSION_KEY = SECRET_KEY

config = Config()
