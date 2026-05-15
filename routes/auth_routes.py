# type:ignore
from flask import Blueprint, request, jsonify, render_template, redirect, url_for, session
from models.user import db, User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['GET'])
def register_page():
    return render_template("signup.html")

@auth_bp.route('/register', methods=['POST'])
def register():
    nom = request.form.get('nom')
    email = request.form.get('email')
    password = request.form.get('password')

    if User.query.filter_by(email=email).first():
        return render_template("signup.html", error="Email already exists")

    user = User(nom=nom, email=email)
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return redirect(url_for('auth.login_page'))


@auth_bp.route('/login', methods=['GET'])
def login_page():
    return render_template("login.html")

@auth_bp.route('/login', methods=['POST'])
def login():
    email = request.form.get('email')
    password = request.form.get('password')

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return render_template("login.html", error="Invalid credentials")

    return redirect(url_for('auth.home'))

@auth_bp.route("/home")
def home():
    return render_template("home.html")

@auth_bp.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('auth.login_page'))