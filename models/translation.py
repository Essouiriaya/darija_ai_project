# type:ignore
from extensions import db
from datetime import datetime

class Translation(db.Model):
    __tablename__ = 'translations'

    id = db.Column(db.Integer, primary_key=True)

    texte_source = db.Column(db.Text, nullable=False)
    langue_cible = db.Column(db.String(20), nullable=False)
    resultat = db.Column(db.Text, nullable=False)
    type_entree = db.Column(db.String(20), nullable=False)

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id'),
        nullable=False
    )

    def __repr__(self):
        return f"<Translation {self.id}>"