from backend.main import create_app
from flask_mail import Mail
from backend.ecommerce.routes import init_mail
import os

app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=5001)