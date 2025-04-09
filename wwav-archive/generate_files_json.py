import os
import json

def get_file_info(directory):
    files = []
    for filename in os.listdir(directory):
        if filename.startswith('.'):  # Skip hidden files like .DS_Store
            continue
            
        file_path = os.path.join(directory, filename)
        if os.path.isfile(file_path):
            name = os.path.splitext(filename)[0]  # Remove extension for name
            files.append({
                "name": name,
                "src": f"{os.path.basename(directory)}/{filename}"
            })
    return files

def get_stems_info(audio_dir):
    stems = []
    for item in os.listdir(audio_dir):
        if item.startswith('[stems]') and os.path.isdir(os.path.join(audio_dir, item)):
            stem_dir = os.path.join(audio_dir, item)
            tracks = []
            
            # Look for standard stem tracks
            for track_file in os.listdir(stem_dir):
                if track_file.endswith(('.mp3', '.wav', '.m4a')):
                    track_name = os.path.splitext(track_file)[0].capitalize()
                    tracks.append({
                        "name": track_name,
                        "file": track_file
                    })
            
            stem_name = item.replace('[stems]_', '').replace('_', ' ').title()
            stems.append({
                "name": stem_name,
                "folder": f"audio/{item}",
                "tracks": tracks
            })
    
    return stems

def generate_files_json():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Define directories to scan
    audio_dir = os.path.join(base_dir, 'audio')
    films_dir = os.path.join(base_dir, 'films')
    images_dir = os.path.join(base_dir, 'images')
    
    # Get file information
    files_data = {
        "audio": get_file_info(audio_dir),
        "films": get_file_info(films_dir),
        "images": get_file_info(images_dir),
        "stems": get_stems_info(audio_dir)
    }
    
    # Write to JSON file
    with open(os.path.join(base_dir, 'files.json'), 'w', encoding='utf-8') as f:
        json.dump(files_data, f, indent=2)
    
    print(f"Generated files.json with {len(files_data['audio'])} audio files, "
          f"{len(files_data['films'])} film files, "
          f"{len(files_data['images'])} image files, and "
          f"{len(files_data['stems'])} stem folders.")

if __name__ == "__main__":
    generate_files_json() 