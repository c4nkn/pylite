import { useEffect, useState } from "react";
import "./App.css";

// components & utils
import Titlebar from "@/components/Titlebar";
import Welcome from "@/components/Welcome";
import Menu from "@/components/Menu";
import Sidebar from "@/components/Sidebar";
import Editor from "./components/Editor";
import { openFileDialog, openFolderDialog } from '@/utils/FsHandler';
import { getLocalStorageItem, removeLocalStorageItem, setLocalStorageItem } from "@/utils/LocalStorage";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useToast } from "@/components/ui/use-toast";


function App() {
  const [openedFile, setOpenedFile] = useState<string | null>(getLocalStorageItem<string>('openedFile'));
  const [openedFolder, setOpenedFolder] = useState<string | null>(getLocalStorageItem<string>('openedFolder'));

  const [fileName, setFileName] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);

  const [isSidebarCollapsed, collapseSidebar] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setLocalStorageItem('openedFile', openedFile);
  }, [openedFile]);

  useEffect(() => {
    setLocalStorageItem('openedFolder', openedFolder);
  }, [openedFolder]);

  const onFileOpen = async () => {
    const selectedFile = await openFileDialog();

    if (openedFolder) {
      setOpenedFolder(null);
      removeLocalStorageItem('openedFolder');
    }

    if (openedFile) {
      setOpenedFile(null);
      removeLocalStorageItem('openedFile');
    } else {
      setOpenedFile(selectedFile as string);
      setLocalStorageItem('openedFile', selectedFile);
    }
  };

  const onFolderOpen = async () => {
    const selectedFolder = await openFolderDialog();

    if (openedFolder) {
      setOpenedFolder(null);
      removeLocalStorageItem('openedFolder');
    }

    if (Array.isArray(selectedFolder)) {
      toast({
        title: "Hehe, I got you!",
        description: "You can't choose multiple folders at once.",
        className: "bg-app-secondary border-none shadow-md text-white",
      });
    } else if (selectedFolder === null) {
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

      setOpenedFolder(selectedFolder as string);
      setLocalStorageItem('openedFolder', selectedFolder)
    }
  };

  const closeFolder = async () => {
    if (openedFile) {
      setOpenedFile(null);
      removeLocalStorageItem('openedFile');
    }

    if (openedFolder) {
      setOpenedFolder(null);
      removeLocalStorageItem('openedFolder');
    }
  }

  const handleFileClick = (file: string, content: string) => {
    setFileName(file);
    setFileContent(content);
    console.log("File clicked event triggered: App.tsx")
  }

  const toggleCollapse = () => {
    collapseSidebar(true);
  }; 

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === 'o') {
        onFileOpen();
      } else if (event.ctrlKey && event.key.toLowerCase() === 'k') {
        onFolderOpen();
      } else if (event.ctrlKey && event.key.toLowerCase() === 'e') {
        closeFolder();
      } else if (event.key === 'F5' || (event.ctrlKey && event.key === 'r') || (event.metaKey && event.key === 'r')) {
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onFileOpen, onFolderOpen]);

  return (
    <div className="flex flex-col h-screen">
      <Titlebar>
        <Menu onOpenFolderDialog={onFolderOpen} closeFolder={closeFolder} isFileOpened={openedFile} isFolderOpened={openedFolder} />
      </Titlebar>
      <main className="flex flex-1 overflow-auto">
        {openedFile || openedFolder ? (
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel className="bg-app-third" defaultSize={isSidebarCollapsed ? 5 : 25} minSize={isSidebarCollapsed ? 5 : 15}>
              <Sidebar onFileClick={handleFileClick} onCollapse={toggleCollapse} />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={isSidebarCollapsed ? 95 : 75} minSize={isSidebarCollapsed ? 95 : 50} className="border-s border-s-app-border">
              <Editor fileName={fileName} fileContent={fileContent} />
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <Welcome onFileOpen={onFileOpen} onOpenFolderDialog={onFolderOpen} />
        )}
      </main>
    </div>
  );
}

export default App;