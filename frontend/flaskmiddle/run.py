from core import app, config

if __name__ == "__main__":
    app.run(host=config.FRONTEND,port=config.FRONTEND_PORT, debug=config.DEBUG, threaded=True)
