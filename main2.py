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
BLOG_DIR = CONTENT_DIR / 'blog'
MUSIC_DIR = CONTENT_DIR / 'music'
WORK_DIR = CONTENT_DIR / 'work'

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

# Main routes
@app.route('/')
def index():
    """Homepage"""
    # Get recent posts for homepage preview
    recent_blog_items = get_items_from_directory(BLOG_DIR)[:3]
    recent_music_items = get_items_from_directory(MUSIC_DIR)[:3]
    recent_work_items = get_items_from_directory(WORK_DIR)[:3]
    
    return render_template('index.html', 
                         recent_blog_items=recent_blog_items,
                         recent_music_items=recent_music_items,
                         recent_work_items=recent_work_items)

# Map section names to their directories and template names
SECTIONS = {
    'blog': {'dir': BLOG_DIR, 'index_template': 'blog/index.html', 'detail_template': 'blog/detail.html'},
    'music': {'dir': MUSIC_DIR, 'index_template': 'music/index.html', 'detail_template': 'music/detail.html'},
    'work': {'dir': WORK_DIR, 'index_template': 'work/index.html', 'detail_template': 'work/detail.html'},
}

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
        ]
    }

if __name__ == '__main__':
    # Create content directories if they don't exist
    os.makedirs(CONTENT_DIR, exist_ok=True)
    os.makedirs(BLOG_DIR, exist_ok=True)
    os.makedirs(MUSIC_DIR, exist_ok=True)
    os.makedirs(WORK_DIR, exist_ok=True)
    
    app.run(debug=True)