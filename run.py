from backend.main import create_app
from flask_mail import Mail
from backend.ecommerce.routes import init_mail
import os

app = create_app()

# Email config
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')

mail = Mail(app)
init_mail(mail)

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=5001)