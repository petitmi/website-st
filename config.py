class Config:
    SECRET_KEY = "CHANGE_THIS"
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False
