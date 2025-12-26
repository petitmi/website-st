from flask import Blueprint, jsonify, request
ecommerce_bp = Blueprint("ecommerce", __name__)

@ecommerce_bp.route('/products', methods=['GET'])
def get_products():
    """Get all products"""
    products = [
        {
            'id': 1,
            'name': 'Classic Aviator',
            'price': 45,
            'image': '🕶️',
            'description': 'Timeless aviator design',
            'moq': 50
        },
        {
            'id': 2,
            'name': 'Retro Round',
            'price': 38,
            'image': '🥽',
            'description': 'Vintage round frames',
            'moq': 50
        },
        # ... add all your products
    ]
    return jsonify(products)

@ecommerce_bp.route('/inquiry', methods=['POST'])
def submit_inquiry():
    """Handle inquiry submission"""
    data = request.json
    
    # Validate data
    if not data.get('name') or not data.get('email') or not data.get('phone'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Here you can:
    # - Save to database
    # - Send email notification
    # - Store in a file
    
    print(f"New inquiry from: {data.get('name')}")
    print(f"Cart items: {data.get('cartItems')}")
    
    return jsonify({
        'success': True,
        'message': 'Thank you! We will contact you shortly.'
    })

@ecommerce_bp.route('/contact-info', methods=['GET'])
def get_contact_info():
    """Get company contact information"""
    return jsonify({
        'email': 'sales@sunstyle.com',
        'phone': '+1 (236) 123-4567',
        'address': '123 Vancouver St, V5R6B7',
        'companyName': 'SunStyle Wholesale'
    })