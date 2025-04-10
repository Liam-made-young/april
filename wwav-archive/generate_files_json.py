import os
import json

def get_file_info(directory, relative_path=''):
    files = []
    folders = []
    
    for filename in os.listdir(directory):
        if filename.startswith('.'):  # Skip hidden files like .DS_Store
            continue
            
        file_path = os.path.join(directory, filename)
        if os.path.isfile(file_path):
            name = os.path.splitext(filename)[0]  # Remove extension for name
            files.append({
                "name": name,
                "src": os.path.join(relative_path, filename).replace('\\', '/')
            })
        elif os.path.isdir(file_path) and not filename.startswith('[stems]'):
            folder_name = filename
            folder_relative_path = os.path.join(relative_path, filename).replace('\\', '/')
            
            # Get the folder contents recursively
            folder_contents = get_file_info(
                file_path, 
                folder_relative_path
            )
            
            folders.append({
                "name": folder_name,
                "type": "folder",
                "path": folder_relative_path,
                "contents": folder_contents
            })
    
    return {"files": files, "folders": folders}

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
    audio_data = get_file_info(audio_dir, 'audio')
    films_data = get_file_info(films_dir, 'films')
    images_data = get_file_info(images_dir, 'images')
    
    # Get stem information
    stems_data = get_stems_info(audio_dir)
    
    # Write to JSON file
    files_data = {
        "audio": {
            "files": audio_data["files"],
            "folders": audio_data["folders"]
        },
        "films": {
            "files": films_data["files"],
            "folders": films_data["folders"]
        },
        "images": {
            "files": images_data["files"],
            "folders": images_data["folders"]
        },
        "stems": stems_data
    }
    
    # Write to JSON file
    with open(os.path.join(base_dir, 'files.json'), 'w', encoding='utf-8') as f:
        json.dump(files_data, f, indent=2)
    
    print(f"Generated files.json with: ")
    print(f"- Audio: {len(files_data['audio']['files'])} files, {len(files_data['audio']['folders'])} folders")
    print(f"- Films: {len(files_data['films']['files'])} files, {len(files_data['films']['folders'])} folders")
    print(f"- Images: {len(files_data['images']['files'])} files, {len(files_data['images']['folders'])} folders")
    print(f"- Stems: {len(files_data['stems'])} stem folders")

if __name__ == "__main__":
    generate_files_json() 