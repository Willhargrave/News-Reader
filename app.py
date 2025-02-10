from flask import Flask
from config import Config
from models import db
from flask_login import LoginManager
from blueprints.auth import auth_bp
from blueprints.news import news_bp
from blueprints.feeds import feeds_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    db.init_app(app)
    login_manager = LoginManager(app)
    login_manager.login_view = 'auth.login'
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(news_bp)
    app.register_blueprint(feeds_bp, url_prefix='/feeds')
    
    with app.app_context():
        db.create_all()  # Create database tables if they don't exist

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)