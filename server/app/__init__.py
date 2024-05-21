# third-party imports
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from datetime import timedelta
# local imports
from config import app_config

# db variable initialization
db = SQLAlchemy()
# create a LoginManager object and initialize it 
login_manager = LoginManager()


def create_app(config_name = "development"):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(app_config[config_name])
    app.config.from_pyfile('config.py')
    db.init_app(app)
    app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=1)

    CORS(app, supports_credentials=True,resources={r"/*": {"origins": app.config['CORS_ORIGINS'],
                                 "headers": app.config['CORS_HEADERS'],
                                 "methods": app.config['CORS_METHODS']}})
    login_manager.init_app(app)
    #  sets the message that will be displayed to users when they attempt to access a page that requires authentication but are not logged in.
    login_manager.login_message = "You must be logged in to access this page."
    # When a user tries to access a protected page without being logged in, Flask-Login will redirect them to this login page so they can authenticate themselves. 
    login_manager.login_view = "auth.login"

    # created a migrate object which will allow us to run migrations using Flask-Migrate
    migrate = Migrate(app, db)
    from app import models

    jwt = JWTManager(app)
    

    from .admin import admin as admin_blueprint
    app.register_blueprint(admin_blueprint, url_prefix='/admin')

    from .auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint, url_prefix='/auth')

    from .home import home as home_blueprint
    app.register_blueprint(home_blueprint)

    return app