import { appWindow } from '@tauri-apps/api/window';
import { Icons } from './Icons';

const Titlebar = ({ children }: { children: React.ReactNode }) => {
  const minimizeApp = async () => {
    appWindow.minimize();
  }

  const maximizeApp = async () => {
    const maximized = await appWindow.isMaximized();

    if (maximized) {
      appWindow.unmaximize();
    } else {
      appWindow.maximize();
    }
  }

  const closeApp = async () => {
    appWindow.close();
  }

  return (
    <header data-tauri-drag-region className="flex flex-row h-9 w-screen justify-between items-center select-none bg-app-secondary">
      <div data-tauri-drag-region className="flex items-center ps-3 w-full">
        <span className="pe-2">{Icons.pyLiteSmall}</span>
        {children}
      </div>
      <div data-tauri-drag-region className='w-full ms-20'>
        PyLite
      </div>
      <div data-tauri-drag-region className="flex">
        <button onClick={minimizeApp} className="h-9 px-4 bg-app-secondary hover:bg-shadow-controls">{Icons.minimizeWin}</button>
        <button onClick={maximizeApp} className="h-9 px-4 bg-app-secondary hover:bg-shadow-controls">{Icons.maximizeWin}</button>
        <button onClick={closeApp} className="h-9 px-4 bg-app-secondary hover:bg-red-600">{Icons.closeWin}</button>
      </div>
    </header>
  )
}

export default Titlebar;