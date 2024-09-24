from flask import Flask
from flask_login import LoginManager
from flask_session import Session

from flask_cors import CORS
from frontend.flaskmiddle.config import config

app = Flask(__name__, template_folder='html', static_url_path='', static_folder='html')

app.config.from_object(config)
CORS(app)

Session(app)

login_control = LoginManager()
login_control.init_app(app)

from frontend.flaskmiddle.core.controller.routes import controller_principal as controller_principal_module
from frontend.flaskmiddle.core.controller.routes_ppg import controller_ppg as controller_ppg_module
from frontend.flaskmiddle.core.controller.routes_graficos import controller_ppg_graficos as controller_ppg_graficos_module

controller_principal_module.register_blueprint(controller_ppg_module)
controller_principal_module.register_blueprint(controller_ppg_graficos_module)

app.register_blueprint(controller_principal_module)


@app.errorhandler(404)
def page_not_found(error):
    print(error)
    return "<h1> Page not found </h1>"
