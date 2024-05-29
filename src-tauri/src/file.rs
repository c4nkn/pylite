use std::fs;

// Read file content in given path
#[tauri::command]
pub fn read_file_content(path: String) -> Result<String, String> {
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