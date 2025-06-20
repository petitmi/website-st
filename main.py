import os
import markdown
import frontmatter
from flask import Flask, render_template, abort
from datetime import datetime
from pathlib import Path

app = Flask(__name__)
# app.config['SECRET_KEY'] = 'your-secret-key-here'

# Content directories
CONTENT_DIR = Path('content')
TEMPLATES_DIR = Path('templates')
BLOG_DIR = CONTENT_DIR / 'blog'
MUSIC_DIR = TEMPLATES_DIR / 'music'
WORK_DIR = CONTENT_DIR / 'work'
GALLERY_DIR = Path('static/img/gallery')

# Utility functions
def get_items_from_directory(directory, sort_by_date=True):
    """Get all markdown posts from a directory with frontmatter parsing"""
    posts = []
    if not directory.exists():
        return posts
    
    for file_path in directory.glob('*.md'):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                post = frontmatter.load(f)
                post['slug'] = file_path.stem
                # post['content_html'] = markdown.markdown(post.content, extensions=['codehilite', 'fenced_code'])
                post['filepath'] = str(file_path)  # Full path; use relative if needed

                # Handle date parsing
                if 'date' in post.metadata:
                    if isinstance(post.metadata['date'], str):
                        post['date'] = datetime.strptime(post.metadata['date'], '%Y-%m-%d')
                
                posts.append(post)
        except Exception as e:
            print(f"Error processing {file_path}: {e}")
    
    if sort_by_date and posts:
        posts.sort(key=lambda x: x.get('date', datetime.min), reverse=True)
    return posts

def get_item_by_slug(directory, slug):
    """Get a specific post by slug"""
    file_path = directory / f"{slug}.md"
    if not file_path.exists():
        return None
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            post = frontmatter.load(f)
            post['slug'] = slug
            post['content_html'] = markdown.markdown(post.content, extensions=['codehilite', 'fenced_code'])
            
            # Handle date parsing
            if 'date' in post.metadata:
                if isinstance(post.metadata['date'], str):
                    post['date'] = datetime.strptime(post.metadata['date'], '%Y-%m-%d')
            
            return post
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return None

# Gallery utility functions
def get_galleries():
    """Get all gallery folders with their metadata"""
    galleries = []

    for gallery_path in GALLERY_DIR.iterdir():
        if gallery_path.is_dir():
            init_file = gallery_path / 'init.md'
            gallery_info = {
                'slug': gallery_path.name,
                'path': gallery_path,
                'title': gallery_path.name.replace('-', ' ').title(),
                'date': None,
            }
            
            # Parse init.md if it exists
            if init_file.exists():
                try:
                    with open(init_file, 'r', encoding='utf-8') as f:
                        metadata = frontmatter.load(f)
                        gallery_info.update({
                            'title': metadata.get('title', gallery_info['title']),
                            'date': metadata.get('date'),
                        })
                        
                        # Handle date parsing
                        if gallery_info['date'] and isinstance(gallery_info['date'], str):
                            gallery_info['date'] = datetime.strptime(gallery_info['date'], '%Y-%m-%d')

                                                        
                except Exception as e:
                    print(f"Error processing gallery metadata {init_file}: {e}")
                        
            galleries.append(gallery_info)
    
    # Sort by date (newest first)
    galleries.sort(key=lambda x: x.get('date') or datetime.min, reverse=True)
    return galleries

def get_gallery_images(gallery_path, pics_list=None):
    """Get all images from a gallery folder"""
    if not gallery_path.exists():
        return []
    gallery_info = {}
    images = []  # Changed from {} to [] since you're appending dictionaries
    image_extensions = {'.jpg', '.JPG', '.jpeg', '.png', '.gif', '.webp', '.bmp'}
    
    # Only read from init.md if pics_list is not provided
    if pics_list is None:
        pics_list = []
        init_file = gallery_path / 'init.md'
        # Parse init.md if it exists
        if init_file.exists():
            with open(init_file, 'r', encoding='utf-8') as f:
                metadata = frontmatter.load(f)
                gallery_info['photographer'] = metadata.get('photographer')
                gallery_info['title'] = metadata.get('title')
                gallery_info['date'] = metadata.get('date')

 
    # Fixed variable name from 'f' to 'file' and added extension check
    imgs_list = [file for file in os.listdir(gallery_path) 
                if os.path.isfile(os.path.join(gallery_path, file)) 
                and os.path.splitext(file)[1] in image_extensions]

    for img_file in imgs_list:  # Changed variable name for clarity
        file_path = gallery_path / img_file
        if file_path.is_file() and file_path.suffix.lower() in image_extensions:
            # Create relative path for web serving
            relative_path = f"/static/img/gallery/{gallery_path.name}/{file_path.name}"
            images.append({
                'filename': file_path.name,
                'path': relative_path,
                'name': file_path.stem.replace('-', ' ').replace('_', ' ').title()
            })    
 
    # If no pics list, return all images sorted by filename
    images.sort(key=lambda x: x['filename'])
    gallery_info['images'] = images
    return gallery_info

# Map section names to their directories and template names
SECTIONS = {
    'blog': {'dir': BLOG_DIR, 'index_template': 'blog/index.html', 'detail_template': 'blog/detail.html'},
    'music': {'dir': MUSIC_DIR, 'index_template': 'music/index.html', 'detail_template': 'music/detail.html'},
    'work': {'dir': WORK_DIR, 'index_template': 'work/index.html', 'detail_template': 'work/detail.html'},
    'gallery': {'dir': WORK_DIR, 'index_template': 'gallery/index.html', 'detail_template': 'gallery/detail.html'},

}
@app.route('/')
def index():
    image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp', '.svg']

    all_images_paths = []
    
    for root, dirs, files in os.walk(GALLERY_DIR):
        dirs[:] = [d for d in dirs if d != 'not-display']

        for file in files:
            if any(file.lower().endswith(ext) for ext in image_extensions):
                # Get relative path from 'static' folder, not from GALLERY_DIR
                full_path = os.path.join(root, file)
                relative_to_static = os.path.relpath(full_path, 'static')
                all_images_paths.append(relative_to_static)
    # Get 3 random images
    import random
    if len(all_images_paths) >= 3:
        random_images_path = random.sample(all_images_paths, 3)
    else:
        # If less than 3 images available, get all of them
        random_images_path = all_images_paths
    print(random_images_path)
    return render_template('index.html', images=random_images_path)


@app.route('/<section>')
def section_index(section):
    if section not in SECTIONS:
        abort(404)
    config = SECTIONS[section]
    items = get_items_from_directory(config['dir'], sort_by_date=True)
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

# Gallery routes
@app.route('/gallery')
def gallery_index():
    """Gallery index page showing all galleries"""
    galleries = get_galleries()
    return render_template('gallery/index.html', galleries=galleries)

@app.route('/gallery/<slug>')
def gallery_detail(slug):
    """Gallery detail page showing all images in a gallery"""
    
    gallery_info = get_gallery_images(GALLERY_DIR / slug)
    
    return render_template('gallery/detail.html', 
                         gallery=gallery_info)
@app.route('/music')
def get_videos():
    import json

    with open(MUSIC_DIR/ 'init.json', 'r') as f:
        data = json.load(f)
        videos = data['videos']
    print(videos)
    return render_template('music/index.html', videos=videos)
    
# Template filters
@app.template_filter('dateformat')
def dateformat(value, format='%B %d, %Y'):
    """Format datetime objects in templates"""
    if isinstance(value, datetime):
        return value.strftime(format)
    return value

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    return render_template('500.html'), 500

# Context processor to make navigation easier
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