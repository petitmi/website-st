import os
import markdown
import frontmatter
from datetime import datetime
import smtplib
import tomllib
from email.mime.text import MIMEText
import socket


def parse_date(date_value):
    """Parse date value and return datetime object or None"""
    if not date_value:
        return None
    
    # Already a datetime object
    if hasattr(date_value, 'strftime'):
        return date_value
    
    # Handle string dates
    if isinstance(date_value, str):
        formats = ['%Y-%m-%d', '%Y-%m', '%Y']
        for fmt in formats:
            try:
                return datetime.strptime(date_value, fmt)
            except ValueError:
                continue
        
    return None

def load_frontmatter_file(file_path):
    """Load and parse a frontmatter file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return frontmatter.load(f)
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return None

def process_post_metadata(post, slug=None):
    """Process common post metadata"""
    if slug:
        post['slug'] = slug
    
    # Handle date parsing and store back to post
    if 'date' in post.metadata:
        processed_date = parse_date(post.metadata['date'])
        post['date'] = processed_date
        post.metadata['date'] = processed_date  
    
    return post

def get_items_from_directory(directory, sort_by_date=True):
    """Get all markdown posts from a directory with frontmatter parsing"""
    posts = []
    if not directory.exists():
        return posts
    
    for file_path in directory.glob('*.md'):
        post = load_frontmatter_file(file_path)
        if post:
            process_post_metadata(post, slug=file_path.stem)
            posts.append(post)
    
    if sort_by_date and posts:
        posts.sort(key=lambda x: x.get('date') or datetime.min, reverse=True)
    return posts

def get_item_by_slug(directory, slug):
    """Get a specific post by slug"""
    file_path = directory / f"{slug}.md"
    if not file_path.exists():
        return None
    
    post = load_frontmatter_file(file_path)
    if not post:
        return None
    
    process_post_metadata(post, slug=slug)
    
    # Generate HTML content
    post['content_html'] = markdown.markdown(
        post.content, 
        extensions=['codehilite', 'fenced_code', 'toc'], 
        extension_configs={
            'toc': {
                'toc_depth': '2-6'  # Only include h2-h6, skip h1
            }
        }
    )
    
    return post

def get_galleries(gallery_dir):
    """Get all gallery folders with their metadata"""
    galleries = []

    for gallery_path in gallery_dir.iterdir():
        if not gallery_path.is_dir():
            continue
            
        gallery_info = {
            'slug': gallery_path.name,
            'path': gallery_path,
            'title': gallery_path.name.replace('-', ' ').title(),
            'date': None,
        }
        
        # Parse init.md if it exists
        init_file = gallery_path / 'init.md'
        if init_file.exists():
            metadata = load_frontmatter_file(init_file)
            if metadata:
                gallery_info.update({
                    'title': metadata.get('title', gallery_info['title']),
                    'date': parse_date(metadata.get('date')),
                })
                    
        galleries.append(gallery_info)
    
    galleries.sort(key=lambda x: x.get('date') or datetime.min, reverse=True)
    return galleries

def get_gallery_images(gallery_path):
    """Get all images from a gallery folder"""
    if not gallery_path.exists():
        return {}
    
    gallery_info = {}
    images = []
    image_extensions = {'.jpg', '.JPG', '.jpeg', '.png', '.gif', '.webp', '.bmp'}
    
    # Parse init.md for metadata
    init_file = gallery_path / 'init.md'
    if init_file.exists():
        metadata = load_frontmatter_file(init_file)
        if metadata:
            gallery_info.update({
                'creator': metadata.get('creator'),
                'title': metadata.get('title'),
                'date': parse_date(metadata.get('date')),
            })

    # Get image files
    for img_file in os.listdir(gallery_path):
        file_path = gallery_path / img_file
        if file_path.is_file() and file_path.suffix in image_extensions:
            relative_path = f"/static/img/gallery/{gallery_path.name}/{file_path.name}"
            images.append({
                'filename': file_path.name,
                'path': relative_path,
                'name': file_path.stem.replace('-', ' ').replace('_', ' ').title()
            })
 
    images.sort(key=lambda x: x['filename'])
    gallery_info['images'] = images
    return gallery_info

# def get_random_gallery_images(gallery_dir, count=3, exclude_dirs=None):
    """Get random images from all galleries"""
    if exclude_dirs is None:
        exclude_dirs = {'not-display'}
    
    image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp', '.svg']
    all_images_paths = []
    
    for root, dirs, files in os.walk(gallery_dir):
        # Remove excluded directories
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        
        for file in files:
            if any(file.lower().endswith(ext) for ext in image_extensions):
                full_path = os.path.join(root, file)
                relative_to_static = os.path.relpath(full_path, 'static')
                all_images_paths.append(relative_to_static)
    
    # Get random images
    import random
    if len(all_images_paths) >= count:
        return random.sample(all_images_paths, count)
    else:
        return all_images_paths

def load_music_data(music_dir):
    """Load music/video data from init.json"""
    import json
    try:
        with open(music_dir / 'init.json', 'r') as f:
            data = json.load(f)
            return data.get('videos', [])
    except Exception as e:
        print(f"Error loading music data: {e}")
        return []

def load_config():
    """Load configuration from secrets.toml"""
    with open("secrets.toml", "rb") as f:
        return tomllib.load(f)

def send_email(message):
    """Send email with the given message"""
    # Store original timeout
    original_timeout = socket.getdefaulttimeout()
    
    try:
        config = load_config()
        email_config = config["email"]
        
        # Set timeout to prevent hanging
        socket.setdefaulttimeout(30)
        
        # Create email
        msg = MIMEText(f"Someone sent you a message: {message}")
        msg['Subject'] = "Message from website"
        msg['From'] = email_config["sender_email"]
        msg['To'] = email_config["recipient_email"]
        
        # Send email with timeout
        with smtplib.SMTP(
            os.getenv("SMTP_SERVER", "smtp.gmail.com"),
            int(os.getenv("SMTP_PORT", "587")),
            timeout=30  # Add explicit timeout here
        ) as server:
            server.starttls()
            server.login(email_config["sender_email"], email_config["sender_password"])
            server.send_message(msg)
        
        print("Email sent successfully!")
        return True
        
    except socket.timeout:
        print("Email error: Connection timeout - SMTP server unreachable")
        return False
    except smtplib.SMTPException as e:
        print(f"SMTP error: {e}")
        return False
    except Exception as e:
        print(f"Email error: {e}")
        return False
    finally:
        # Always restore original timeout
        socket.setdefaulttimeout(original_timeout)