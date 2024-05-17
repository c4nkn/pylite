import { useEffect, useState } from "react";
import "./App.css";

// shadcn
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { useToast } from "@/components/ui/use-toast";

// components
import Titlebar from "@/components/Titlebar";
import Welcome from "@/components/Welcome";
import Menu from "@/components/Menu";

// utils
import { openFolderDialog } from '@/utils/FsHandler';
import { getLocalStorageItem, removeLocalStorageItem, setLocalStorageItem } from "@/utils/LocalStorage";


function App() {
  const [openedFile, setOpenedFile] = useState<string | null>(getLocalStorageItem<string>('openedFile'));
  const [openedFolder, setOpenedFolder] = useState<string | null>(getLocalStorageItem<string>('openedFolder'));
  const { toast } = useToast();

  useEffect(() => {
    setLocalStorageItem('openedFile', openedFile);
  }, [openedFile]);

  useEffect(() => {
    setLocalStorageItem('openedFolder', openedFolder);
  }, [openedFolder]);

  const handleFileOpened = () => {
    if (openedFolder) {
      setOpenedFolder(null);
      removeLocalStorageItem('openedFolder');
    }
    if (openedFile) {
      setOpenedFile(null);
      removeLocalStorageItem('openedFile');
    }
    setOpenedFile(null);
  };

  const handleFolderOpened = async () => {
    const selected = await openFolderDialog();

    if (openedFolder) {
      setOpenedFolder(null);
      removeLocalStorageItem('openedFolder');
    }

    if (Array.isArray(selected)) {
      toast({
        title: "Hehe, I got you!",
        description: "You can't choose multiple folders at once.",
        className: "bg-app-secondary border-none shadow-md text-white",
      });
    } else if (selected === null) {
      toast({
        title: "Meh, next time maybe.",
        description: "Couldn't open folder because you didn't make any choice.",
        className: "bg-app-secondary border-none shadow-md text-white",
      });
    } else {
      toast({
        title: "Hang on! We're almost there.",
        description: "I'm trying to open folder that you choosed. :P",
        className: "bg-app-secondary border-none shadow-md text-white",
      });

      setOpenedFolder(selected);
      setLocalStorageItem('openedFolder', openedFolder)
    }
  };

  const closeFolder = async() => {
    setOpenedFile(null);
    removeLocalStorageItem('openedFile');
    setOpenedFolder(null);
    removeLocalStorageItem('openedFolder');
  }

  const [isTwoOpen, setIsTwoOpen] = useState(false);

  const toggleTwoPanel = () => {
    setIsTwoOpen(!isTwoOpen);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === 'o') {
        handleFileOpened();
      } else if (event.ctrlKey && event.key.toLowerCase() === 'k') {
        handleFolderOpened();
      } else if (event.ctrlKey && event.key.toLowerCase() === 'e') {
        closeFolder();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleFileOpened, handleFolderOpened, toggleTwoPanel]);

  return (
    <div className="flex flex-col h-screen">
      <Titlebar>
        <Menu onOpenFolderDialog={handleFolderOpened} closeFolder={closeFolder} folderOpened={openedFolder} />
      </Titlebar>
      <main className="flex flex-1 overflow-auto">
        {openedFile || openedFolder ? (
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel className="bg-app-third">
              <div className="h-full w-full flex flex-col">
                <header className="flex h-10 bg-zinc-800">Header</header>
                <div className="flex flex-1 overflow-auto p-2">
                  Content
                </div>
                <footer className="flex h-10 bg-zinc-800">Footer</footer>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel>
              <div className="h-full w-full flex flex-col">
                <header className="flex h-10 bg-zinc-800">Header</header>
                <div className="flex flex-1 overflow-auto">
                  <ResizablePanelGroup direction="vertical">
                    <ResizablePanel className="h-full !overflow-auto p-4">
                      Content
                    </ResizablePanel>
                    {isTwoOpen && (
                      <>
                        <ResizableHandle />
                        <ResizablePanel className="bg-zinc-800">
                          Two
                          <button onClick={toggleTwoPanel} className="ms-2 h-10 px-2 bg-blue-500 text-white">
                            Close
                          </button>  
                        </ResizablePanel>
                      </>
                    )}
                  </ResizablePanelGroup>
                </div>
                <footer className="flex h-10 bg-zinc-900 items-center">
                  Footer
                  <button onClick={toggleTwoPanel} className="ms-2 h-10 px-2 bg-blue-500 text-white">
                    {isTwoOpen ? 'Close Two' : 'Open Two'}
                  </button>
                </footer>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <Welcome onFileOpen={handleFileOpened} onOpenFolderDialog={handleFolderOpened} />
        )}
      </main>
    </div>
  );
}

export default App;