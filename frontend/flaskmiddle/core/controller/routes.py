import time
from flask import Blueprint
import hashlib

controller_principal = Blueprint('principal', __name__)

@controller_principal.app_template_filter()
def hash_url(url):
    m = hashlib.sha256()
    m.update(str(time.time()).encode("utf-8"))
    return f'{url}?v={m.hexdigest()}'

@controller_principal.route("/")
def root(pagina=None):
    return ""