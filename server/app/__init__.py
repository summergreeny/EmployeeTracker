# third-party imports
from flask import Flask
from flask import jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from datetime import timedelta
import logging
# local imports
from config import app_config

# db variable initialization
db = SQLAlchemy()
# create a LoginManager object and initialize it 
login_manager = LoginManager()

def check_db_connection(app):
    """
    Check the connection to the database and print a success message if connected.
    """
    try:
        with app.app_context():
            with db.engine.connect() as connection:
                    connection.execute(text('SELECT 1'))
        print(f"Successfully connected to the database with URI: {app.config['SQLALCHEMY_DATABASE_URI']}")
    except Exception as e:
        print(f"Failed to connect to the database. Error: {e}")


def create_app(config_name=None):
    """
    Create and configure an instance of the Flask application.
    
    Parameters:
    config_name (str): The configuration name to use (e.g., 'development', 'testing', 'production').
                       If None, defaults to 'development'.
    
    Returns:
    Flask app: The configured Flask application instance.
    """

    if config_name is None:
        config_name = "development"  # Set a default configuration name
    print(f"Using configuration: {config_name}")
    # crete a Flask app instance
    # look for instance configuration files relative to the instance folder. 
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(app_config[config_name])
    app.config.from_pyfile('config.py')
    db.init_app(app)

    with app.app_context():
        db.create_all()
    logging.info(f"Using database URI: {app.config['SQLALCHEMY_DATABASE_URI']}")

    # Set session lifetime
    app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=1)

    # Enable CORS
    CORS(app, supports_credentials=True,resources={r"/*": {"origins": app.config['CORS_ORIGINS'],
                                 "headers": app.config['CORS_HEADERS'],
                                 "methods": app.config['CORS_METHODS']}})

    CORS(app, resources={r"/*": {"origins": "http://localhost:30000"}})

    # Initialize LoginManager
    login_manager.init_app(app)
    login_manager.login_message = "You must be logged in to access this page."
    login_manager.login_view = "auth.login"

    # created a migrate object which will allow us to run migrations using Flask-Migrate
    migrate = Migrate(app, db)
    from app import models

    # Register blueprints
    from .admin import admin as admin_blueprint
    app.register_blueprint(admin_blueprint, url_prefix='/admin')

    from .auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint, url_prefix='/auth')

    from .home import home as home_blueprint
    app.register_blueprint(home_blueprint)

    # Add a simple route for testing purposes
    @app.route('/ping')
    def ping():
        return 'pong'

    # Check the database connection
    check_db_connection(app)

    return app


@login_manager.unauthorized_handler
def unauthorized_handler():
    return jsonify(message="please log in"), 401


@login_manager.user_loader
def load_user(user_id):
    from .models import Employee
    user = Employee.query.get(int(user_id))
    return user

def configure_logging():
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
