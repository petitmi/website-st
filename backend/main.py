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
    
    @app.route('/debug-static')
    def debug_static():
        import os
        static_path = app.static_folder
        files = []
        for root, dirs, filenames in os.walk(static_path):
            for f in filenames:
                files.append(os.path.join(root, f).replace(static_path, ''))
        return f"""
        <h3>Static folder: {static_path}</h3>
        <h3>Static URL path: {app.static_url_path}</h3>
        <h3>Files found:</h3>
        <pre>{chr(10).join(files)}</pre>
        """
       
    # Register blueprints
    app.register_blueprint(personal_bp)
    app.register_blueprint(ecommerce_bp, url_prefix='/api')

    # Define react build path
    react_build = os.path.join(os.path.dirname(__file__), "..", "frontend", "sunglasses", "build")

    @app.route("/store", defaults={"path": ""})
    @app.route("/store/<path:path>")
    def serve_store(path):
        # If path exists and is a file, serve it
        file_path = os.path.join(react_build, path)
        if path and os.path.isfile(file_path):
            return send_from_directory(react_build, path)
        # Otherwise serve index.html
        return send_from_directory(react_build, "index.html")

    return app