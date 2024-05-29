// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#![allow(non_snake_case)]

mod file;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

use std::process::Command;

#[tauri::command]
fn get_python_version() -> String {
    let output = Command::new("python")
        .arg("--version")
        .output()
        .expect("Failed to execute command");

    let version = String::from_utf8_lossy(&output.stdout);
    version.to_string()
}

#[tauri::command]
fn get_python_exec_path() -> String {
    let output = Command::new("python")
        .arg("-c")
        .arg("import os, sys; print(sys.executable)")
        .output()
        .expect("Failed to execute command");

    let path = String::from_utf8_lossy(&output.stdout);
    path.to_string()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet, 
            get_python_version,
            get_python_exec_path,
            file::get_files_and_subdirs, 
            file::read_file_content
        ])
        .plugin(tauri_plugin_pty::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
