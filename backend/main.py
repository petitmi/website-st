from flask import Flask
from .personal.routes import personal_bp
from .ecommerce.routes import ecommerce_bp
from flask import send_from_directory
import os

def create_app():
    # Get the backend directory path
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, ".."))

    app = Flask(
        __name__,
        template_folder=os.path.join(BASE_DIR, "personal/templates"),
        static_folder=os.path.join(BASE_DIR, "personal/static")
    )

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
    sunglasses_build = os.path.join(PROJECT_ROOT, "frontend", "sunglasses", "build")
    horse_build = os.path.join(PROJECT_ROOT, "frontend", "NewYearHorse", "build")
    @app.route("/store", defaults={"path": ""})
    @app.route("/store/<path:path>")
    def serve_store(path):
        # If path exists and is a file, serve it
        file_path = os.path.join(sunglasses_build, path)
        if path and os.path.isfile(file_path):
            return send_from_directory(sunglasses_build, path)
        # Otherwise serve index.html
        return send_from_directory(sunglasses_build, "index.html")
    

    @app.route('/new-year-horse', defaults={'path': ''})
    @app.route('/new-year-horse/<path:path>')
    def serve_horse(path):

        file_path = os.path.join(horse_build, path)

        # If requesting a real file -> return file
        if path and os.path.exists(file_path) and not os.path.isdir(file_path):
            return send_from_directory(horse_build, path)

        # Otherwise return React app
        return send_from_directory(horse_build, 'index.html')
