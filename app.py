# type:ignore
from flask import Flask
from flask import render_template, redirect, url_for
from flask_cors import CORS
from extensions import db
from routes.auth_routes import auth_bp
from routes.translation_routes import translation_bp
import config

app = Flask(__name__)
app.config.from_object(config)

CORS(app)

db.init_app(app)

app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(translation_bp, url_prefix="/api")

@app.route("/")
def home():
    return render_template("index.html")

with app.app_context():
    import models
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)