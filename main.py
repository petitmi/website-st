from flask import Flask, render_template, abort, request, jsonify
from datetime import datetime
from pathlib import Path
import os
from utils import (
    get_items_from_directory,
    get_item_by_slug,
    get_galleries,
    get_gallery_images,
    get_random_gallery_images,
    load_music_data,
    send_email
)

app = Flask(__name__)

# Content directories
CONTENT_DIR = Path('content')
TEMPLATES_DIR = Path('templates')
BLOG_DIR = CONTENT_DIR / 'blog'
MUSIC_DIR = TEMPLATES_DIR / 'music'
WORK_DIR = CONTENT_DIR / 'work'
GALLERY_DIR = Path('static/img/gallery')

# Map section names to their directories and template names
SECTIONS = {
    'blog': {'dir': BLOG_DIR, 'index_template': 'blog/index.html', 'detail_template': 'blog/detail.html'},
    'work': {'dir': WORK_DIR, 'index_template': 'work/index.html', 'detail_template': 'work/detail.html'},
}

@app.route('/')
def index():
    random_images = get_random_gallery_images(GALLERY_DIR, count=3, exclude_dirs=['not-display'])
    return render_template('index.html', images=random_images)

@app.route('/<section>')
def section_index(section):
    if section not in SECTIONS:
        abort(404)
    config = SECTIONS[section]
    items = get_items_from_directory(config['dir'])
    return render_template(config['index_template'], item=items)

@app.route('/<section>/<slug>')
def section_detail(section, slug):
    if section not in SECTIONS:
        abort(404)
    config = SECTIONS[section]
    item = get_item_by_slug(config['dir'], slug)
    if not item:
        abort(404)
    return render_template(config['detail_template'], item=item)

@app.route('/gallery')
def gallery_index():
    """Gallery index page showing all galleries"""
    galleries = get_galleries(GALLERY_DIR)
    return render_template('gallery/index.html', galleries=galleries)

@app.route('/gallery/<slug>')
def gallery_detail(slug):
    """Gallery detail page showing all images in a gallery"""
    gallery_info = get_gallery_images(GALLERY_DIR / slug)
    return render_template('gallery/detail.html', gallery=gallery_info)

@app.route('/music')
def music_index():
    videos = load_music_data(MUSIC_DIR)
    return render_template('music/index.html', videos=videos)

@app.template_filter('dateformat')
def dateformat(value, format='%B %d, %Y'):
    """Format datetime objects in templates"""
    if isinstance(value, datetime):
        return value.strftime(format)
    return value

@app.route('/send_email', methods=['POST'])
def handle_email():
    data = request.get_json()
    message = data.get('message', '')
    
    if send_email(message):
        return jsonify({"status": "Successful! You also unlock my email: petitmi001@gmail.com."})
    else:
        return jsonify({"status": "Failed! But you unlock my email: petitmi001@gmail.com."})


@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    return render_template('500.html'), 500

@app.context_processor
def inject_navigation():
    """Add navigation data to all templates"""
    return {
        'nav_items': [
            {'name': 'Home', 'url': '/'},
            {'name': 'Blog', 'url': '/blog'},
            {'name': 'Music', 'url': '/music'},
            {'name': 'Work', 'url': '/work'},
            {'name': 'Gallery', 'url': '/gallery'},
        ]
    }

if __name__ == '__main__':
    # Create content directories if they don't exist
    os.makedirs(CONTENT_DIR, exist_ok=True)
    os.makedirs(BLOG_DIR, exist_ok=True)
    os.makedirs(MUSIC_DIR, exist_ok=True)
    os.makedirs(WORK_DIR, exist_ok=True)
    os.makedirs(GALLERY_DIR, exist_ok=True)
    
    app.run(host='0.0.0.0', port=5000)