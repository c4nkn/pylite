use std::fs;

// Read file content in given path
#[tauri::command]
pub fn read_file_content(path: String) -> Result<String, String> {
    if !path.exists() {
        return Err(format!("File does not exist: {:?}", path));
    }
    if !path.is_file() {
        return Err(format!("Path is not a file: {:?}", path));
    }
    
    match fs::read_to_string(&path) {
        Ok(content) => Ok(content),
        Err(_) => Err("Failed to read file content.".to_string()),
    }
}

// Get files and folders in given directory
#[tauri::command]
pub fn get_files_and_subdirs(path: &str) -> Vec<String> {
    let paths = fs::read_dir(path).unwrap();
    let mut entries = Vec::new();

    if !path.exists() {
        return Err(format!("Directory does not exist: {:?}", path));
    }
    if !path.is_dir() {
        return Err(format!("Path is not a directory: {:?}", path));
    }

    for entry in paths {
        let entry = entry.unwrap();
        let metadata = entry.metadata().unwrap();
        let file_name = entry.file_name().into_string().unwrap();

        if metadata.is_dir() {
            entries.push(format!("{}/", file_name));
        } else {
            entries.push(file_name);
        }
    }

    entries
}