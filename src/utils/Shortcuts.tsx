export const handleKeyDown = (event: KeyboardEvent) => {
  if (event.ctrlKey && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    console.log('Ctrl+K pressed');
  }
};

export const registerShortcuts = () => {
  window.addEventListener('keydown', handleKeyDown);
};

export const unregisterShortcuts = () => {
  window.removeEventListener('keydown', handleKeyDown);
};