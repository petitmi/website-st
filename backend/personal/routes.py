from flask import Blueprint, render_template, abort
from datetime import datetime
from pathlib import Path
from .utils import get_items_from_directory, get_item_by_slug, get_galleries, get_gallery_images, load_music_data

personal_bp = Blueprint('personal', __name__)

# Content directories
CONTENT_DIR = Path(__file__).parent / "content"
BLOG_DIR = CONTENT_DIR / "blog"
WORK_DIR = CONTENT_DIR / "work"
GALLERY_DIR = Path(__file__).parent / "static/img/gallery"
TEMPLATES_DIR = Path(__file__).parent / "templates"
MUSIC_DIR = TEMPLATES_DIR / "music"

SECTIONS = {
    'blog': {'dir': BLOG_DIR, 'index_template': 'blog/index.html', 'detail_template': 'blog/detail.html'},
    'work': {'dir': WORK_DIR, 'index_template': 'work/index.html', 'detail_template': 'work/detail.html'},
}

@personal_bp.route('/')
def index():
    return render_template('index.html')

@personal_bp.route('/<section>')
def section_index(section):
    if section not in SECTIONS:
        abort(404)
    items = get_items_from_directory(SECTIONS[section]['dir'])
    return render_template(SECTIONS[section]['index_template'], items=items)

@personal_bp.route('/<section>/<slug>')
def section_detail(section, slug):
    if section not in SECTIONS:
        abort(404)
    item = get_item_by_slug(SECTIONS[section]['dir'], slug)
    if not item:
        abort(404)
    return render_template(SECTIONS[section]['detail_template'], item=item)

@personal_bp.route('/gallery')
def gallery_index():
    galleries = get_galleries(GALLERY_DIR)
    return render_template('gallery/index.html', galleries=galleries)

@personal_bp.route('/gallery/<slug>')
def gallery_detail(slug):
    gallery_info = get_gallery_images(GALLERY_DIR / slug)
    return render_template('gallery/detail.html', gallery=gallery_info)

@personal_bp.route('/music')
def music_index():
    videos = load_music_data(MUSIC_DIR)
    return render_template('music/index.html', videos=videos)
