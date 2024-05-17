import { open } from '@tauri-apps/api/dialog';

export async function openFolderDialog() {
  try {
    const selected = await open({
      directory: true,
      multiple: false,
      title: "Select folder"
    });

    return selected;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function openFileDialog() {
  try {
    const selected = await open({
      multiple: false,
      title: "Select file"
    });

    return selected;
  } catch (err) {
    console.error(err);
    return null;
  }
}