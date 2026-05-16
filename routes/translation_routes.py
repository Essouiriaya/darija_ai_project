# routes/translation_routes.py
# type: ignore
from flask import Blueprint, request, jsonify, render_template
from models.user import db
from models.translation import Translation
from datetime import datetime

from ai_models.translator_service import translate_text

translation_bp = Blueprint('translation', __name__)

@translation_bp.route('/translate', methods=['GET'])
def translate_page():

    user_id = session.get("user_id")

    if not user_id:
        return redirect(url_for("auth.login_page"))

    return render_template("translate.html")

@translation_bp.route('/history')
def history_page():

    user_id = session.get("user_id")
    if not user_id:
        return redirect(url_for("auth.login_page"))

    return render_template("history.html")

@translation_bp.route('/translate-text', methods=['POST'])
def translate_text_route():

    data = request.get_json()

    user_id = session.get("user_id")
    texte_source = data.get('texte_source')
    langue_cible = data.get('langue_cible')

    if not user_id or not texte_source or not langue_cible:
        return jsonify({"error": "Missing fields"}), 400

    try:
        resultat = translate_text(texte_source)

        translation = Translation(
            texte_source=texte_source,
            langue_cible=langue_cible,
            resultat=resultat,
            type_entree="text",
            user_id=user_id,
            created_at=datetime.utcnow()
        )

        db.session.add(translation)
        db.session.commit()

        return jsonify({
            "status": "success",
            "input": texte_source,
            "output": resultat,
            "language": langue_cible
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@translation_bp.route('/translate-audio', methods=['POST'])
def translate_audio():

    try:
        user_id = session.get("user_id")
        langue_cible = request.form.get('langue_cible')
        audio = request.files.get('audio')

        if not user_id:
            return jsonify({"error": "User not logged in"}), 401

        if not langue_cible or not audio:
            return jsonify({"error": "Missing fields"}), 400

        os.makedirs("uploads", exist_ok=True)

        filename = secure_filename(audio.filename)
        filepath = os.path.join("uploads", filename)

        audio.save(filepath)

        texte_extrait = speech_to_text(filepath)
        if not texte_extrait:
            return jsonify({"error": "No speech detected"}), 400

        resultat = translate_text(texte_extrait)

        translation = Translation(
            texte_source=texte_extrait,
            langue_cible=langue_cible,
            resultat=resultat,
            type_entree="audio",
            user_id=user_id,
            created_at=datetime.utcnow()
        )

        db.session.add(translation)
        db.session.commit()

        return jsonify({
            "status": "success",
            "extracted_text": texte_extrait,
            "translation": resultat
        }), 200

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": str(e)}), 500

@translation_bp.route('/translate-image', methods=['POST'])
def translate_image():

    try:

        user_id = session.get("user_id")
        langue_cible = request.form.get('langue_cible')
        image = request.files.get('image')

        if not user_id or not langue_cible or not image:
            return jsonify({"error": "Missing fields"}), 400

        os.makedirs("uploads", exist_ok=True)

        from werkzeug.utils import secure_filename
        filename = secure_filename(image.filename)
        filepath = os.path.join("uploads", filename)
        image.save(filepath)

        texte_extrait = extract_text(filepath)
        if not texte_extrait:
            return jsonify({"error": "No text detected"}), 400
        
        resultat = translate_text(texte_extrait)

        translation = Translation(
            texte_source=texte_extrait,
            langue_cible=langue_cible,
            resultat=resultat,
            type_entree="image",
            user_id=user_id,
            created_at=datetime.utcnow()
        )

        db.session.add(translation)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Image translated successfully",
            "extracted_text": texte_extrait,
            "translation": resultat
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500