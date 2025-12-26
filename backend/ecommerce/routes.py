from flask import Blueprint, jsonify

ecommerce_bp = Blueprint("ecommerce", __name__)

@ecommerce_bp.route("/api/test")
def test_api():
    return jsonify({"message": "API works"})
