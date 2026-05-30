# routes/translation_routes.py
# type: ignore
from flask import Blueprint, request, jsonify, render_template, session, redirect, url_for
import os
from werkzeug.utils import secure_filename
from datetime import datetime

from models.translation import Translation
from models.user import db

from ai_models.translator_service import translate_text
from ai_models.speech_service import speech_to_text
from ai_models.ocr_service import extract_text


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

    translations = Translation.query.filter_by(
        user_id=user_id
    ).order_by(Translation.created_at.desc()).all()

    return render_template("history.html", translations=translations)


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
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@translation_bp.route('/translate-audio', methods=['POST'])
def translate_audio():
    print("🔥 TRANSLATION ROUTE FILE LOADED")
    try:
        print("🔥 AUDIO ROUTE HIT")

        user_id = session.get("user_id")
        print("USER ID:", user_id)

        langue_cible = request.form.get('langue_cible')
        audio = request.files.get('audio')

        print("LANG:", langue_cible)
        print("AUDIO:", audio)

        if not user_id:
            return jsonify({"error": "User not logged in"}), 401

        if not audio:
            return jsonify({"error": "No audio"}), 400

        os.makedirs("uploads", exist_ok=True)

        filename = secure_filename(audio.filename)
        filepath = os.path.join("uploads", filename)

        audio.save(filepath)

        print("FILE SAVED:", filepath)

        texte_extrait = speech_to_text(filepath)

        print("WHISPER OUTPUT:", texte_extrait)

        resultat = translate_text(texte_extrait)
        translation = Translation(
            texte_source=texte_extrait,
            langue_cible=langue_cible or "auto",
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
        })
    
    
    except Exception as e:
        import traceback
        print("🔥 FULL ERROR:")
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500
    

@translation_bp.route('/translate-image', methods=['POST'])
def translate_image():

    image = request.files.get("image")
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "User not logged in"}), 401

    if not image:
        return jsonify({"error": "No image uploaded"}), 400

    os.makedirs("uploads", exist_ok=True)

    filename = secure_filename(image.filename)
    filepath = os.path.join("uploads", filename)

    image.save(filepath)

    text = extract_text(filepath)

    if not text or text.strip() == "":
        return jsonify({
            "extracted_text": "",
            "translation": "No text found"
        }), 200

    result = translate_text(text)

    # ✅ SAVE TO DATABASE (THIS WAS MISSING)
    translation = Translation(
        texte_source=text,
        langue_cible="auto",   # or request form if you have it
        resultat=result,
        type_entree="image",
        user_id=user_id,
        created_at=datetime.utcnow()
    )

    db.session.add(translation)
    db.session.commit()

    return jsonify({
        "extracted_text": text,
        "translation": result
    }), 200