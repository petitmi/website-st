from PIL import Image
import pillow_heif
import os
import glob
import shutil

# Register HEIF opener with Pillow
pillow_heif.register_heif_opener()

def convert_and_move_heic(input_folder, jpeg_folder, heic_folder="heic"):
    # Create output folders if they don't exist
    if not os.path.exists(jpeg_folder):
        os.makedirs(jpeg_folder)
    if not os.path.exists(heic_folder):
        os.makedirs(heic_folder)
    
    # Find all HEIC files
    heic_files = glob.glob(os.path.join(input_folder, "*.heic")) + \
                 glob.glob(os.path.join(input_folder, "*.HEIC"))
    
    if not heic_files:
        print("No HEIC files found!")
        return
    
    for heic_file in heic_files:
        try:
            # Open and convert
            image = Image.open(heic_file)
            
            # Create output filename for JPEG
            base_name = os.path.splitext(os.path.basename(heic_file))[0]
            jpeg_path = os.path.join(jpeg_folder, f"{base_name}.jpg")
            
            # Convert to RGB and save as JPEG
            rgb_image = image.convert('RGB')
            rgb_image.save(jpeg_path, 'JPEG', quality=95)
            
            print(f"Converted: {heic_file} -> {jpeg_path}")
            
            # Move original HEIC file to heic subfolder
            heic_destination = os.path.join(heic_folder, os.path.basename(heic_file))
            shutil.move(heic_file, heic_destination)
            
            print(f"Moved: {heic_file} -> {heic_destination}")
            
        except Exception as e:
            print(f"Error processing {heic_file}: {e}")

# Run the conversion and move
if __name__ == "__main__":
    base_folder = 'static/img/gallery/uncategorized'
    heic_subfolder = os.path.join(base_folder, 'heic')
    
    convert_and_move_heic(base_folder, base_folder, heic_subfolder)
    print("Conversion and organization complete!")
    