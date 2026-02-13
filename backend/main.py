from flask import Flask, send_from_directory, abort, make_response
from .personal.routes import personal_bp
from .ecommerce.routes import ecommerce_bp
from werkzeug.utils import safe_join
from pathlib import Path
import os


def _serve_spa(build_dir: Path, path: str):
    if not build_dir.exists():
        abort(404, description=f"Build directory not found: {build_dir}")

    # Serve real asset files
    if path:
        file_path = safe_join(str(build_dir), path)
        if file_path and os.path.isfile(file_path):
            response = make_response(send_from_directory(build_dir, path))
            # Long cache for hashed assets
            if any(x in path for x in ["/static/", ".js", ".css", ".png", ".jpg", ".jpeg", ".webp", ".svg", ".woff", ".woff2"]):
                response.cache_control.public = True
                response.cache_control.max_age = 31536000
            return response

    # Otherwise return SPA entry (never cache)
    response = make_response(send_from_directory(build_dir, "index.html"))
    response.cache_control.no_cache = True
    return response


def create_app():
    backend_dir = Path(__file__).resolve().parent

    app = Flask(
        __name__,
        template_folder=backend_dir / "personal" / "templates",
        static_folder=backend_dir / "personal" / "static",
        static_url_path="/static",
    )

    # Blueprints
    app.register_blueprint(personal_bp)
    app.register_blueprint(ecommerce_bp, url_prefix="/api")

    # React build paths
    sunglasses_build = (backend_dir.parent / "frontend" / "sunglasses" / "build").resolve()
    horse_build = (backend_dir.parent / "frontend" / "NewYearHorse" / "build").resolve()

    @app.route("/store", defaults={"path": ""})
    @app.route("/store/<path:path>")
    def serve_store(path):
        return _serve_spa(sunglasses_build, path)

    @app.route("/new-year-horse", defaults={"path": ""})
    @app.route("/new-year-horse/<path:path>")
    def serve_horse(path):
        return _serve_spa(horse_build, path)

    @app.route("/health")
    def health():
        return {"status": "ok"}

    return app
