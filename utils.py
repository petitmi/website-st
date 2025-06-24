import os
import markdown
import frontmatter
from datetime import datetime

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
                
                # Handle date parsing
                if 'date' in post.metadata and isinstance(post.metadata['date'], str):
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
            if 'date' in post.metadata and isinstance(post.metadata['date'], str):
                post['date'] = datetime.strptime(post.metadata['date'], '%Y-%m-%d')
            
            return post
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return None

def get_galleries(gallery_dir):
    """Get all gallery folders with their metadata"""
    galleries = []

    for gallery_path in gallery_dir.iterdir():
        if gallery_path.is_dir():
            gallery_info = {
                'slug': gallery_path.name,
                'path': gallery_path,
                'title': gallery_path.name.replace('-', ' ').title(),
                'date': None,
            }
            
            # Parse init.md if it exists
            init_file = gallery_path / 'init.md'
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
        try:
            with open(init_file, 'r', encoding='utf-8') as f:
                metadata = frontmatter.load(f)
                gallery_info.update({
                    'creator': metadata.get('creator'),
                    'title': metadata.get('title'),
                    'date': metadata.get('date'),
                })
        except Exception as e:
            print(f"Error processing gallery metadata {init_file}: {e}")

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

def get_random_gallery_images(gallery_dir, count=3, exclude_dirs=None):
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

# def parse_date_string(date_str, format='%Y-%m-%d'):
#     """Parse date string into datetime object"""
#     try:
#         return datetime.strptime(date_str, format)
#     except (ValueError, TypeError):
#         return None

# def create_directories(*directories):
#     """Create multiple directories if they don't exist"""
#     for directory in directories:
#         os.makedirs(directory, exist_ok=True)