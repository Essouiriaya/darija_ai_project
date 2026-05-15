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
    return render_template("translate.html")

@translation_bp.route('/history', methods=['GET'])
def history_page():
    return render_template("history.html")

@translation_bp.route('/translate-text', methods=['POST'])
def translate_text_route():

    data = request.get_json()

    user_id = data.get('user_id')
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