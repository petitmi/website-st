from flask import Flask
from backend.personal.routes import personal_bp
from backend.ecommerce.routes import ecommerce_bp
from flask import send_from_directory
import os


def create_app():
    app = Flask(__name__,
                template_folder="personal/templates",
                static_folder="personal/static")

    # Register blueprints
    app.register_blueprint(personal_bp)         # personal routes at /
    app.register_blueprint(ecommerce_bp, url_prefix='/api')  # ecommerce routes at /api
    
    
    @app.route("/store", defaults={"path": ""})
    @app.route("/store/<path:path>")
    def serve_store(path):
        react_build = os.path.join(os.path.dirname(__file__), "..", "frontend", "sunglasses", "build")
        if path and os.path.exists(os.path.join(react_build, path)):
            return send_from_directory(react_build, path)
        return send_from_directory(react_build, "index.html")
    return app
