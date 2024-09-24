from flask import (redirect,session)

from flask.helpers import url_for
from flask_login import logout_user

from core import login_control
from core.models.User import Usuario


@login_control.user_loader
def load_user(user_id):
    if 'user' in session and 'access_token' in session['user']:
        user = Usuario.getUsuario(user_id, session['user']['access_token'])
        return user

@login_control.unauthorized_handler
def unauthorized():
    logout_user()
    session.clear()
    return redirect(url_for('principal.controller_ppg.login_get'))