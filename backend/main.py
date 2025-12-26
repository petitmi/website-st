from flask import Flask
from .personal.routes import personal_bp
from .ecommerce.routes import ecommerce_bp
from flask import send_from_directory
import os

def create_app():
    # Get the backend directory path
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    
    app = Flask(__name__,
                template_folder=os.path.join(backend_dir, "personal/templates"),
                static_folder=os.path.join(backend_dir, "personal/static"))

    # Register blueprints
    app.register_blueprint(personal_bp)         # personal routes at /
    # ecommerce routes at /api
    app.register_blueprint(ecommerce_bp, url_prefix='/api')

    @app.route("/store", defaults={"path": ""})
    @app.route("/store/<path:path>")
    def serve_store(path):
        react_build = os.path.join(os.path.dirname(
            __file__), "..", "frontend", "sunglasses", "build")
        if path and os.path.exists(os.path.join(react_build, path)):
            return send_from_directory(react_build, path)
        return send_from_directory(react_build, "index.html")

    return app
