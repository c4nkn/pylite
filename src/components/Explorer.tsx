import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FileDirectoryFillIcon } from "@primer/octicons-react";
import { DocumentTextIcon } from '@heroicons/react/24/solid'
import { getLocalStorageItem } from "@/utils/LocalStorage";

const Explorer = ({ directory, level = 0, onFileClick }: { directory: string | null, level?: number, onFileClick: (file: string, content: string) => void }) => {
  const [content, setContent] = useState<string[]>([]);

  let activeTab: { fileId: number; fileName: string; fileContent: string; } | undefined;
  
  useEffect(() => {
    const openedTabs = getLocalStorageItem<{ fileId: number, fileName: string, fileContent: string }[]>('openedTabs');
    const activeTabId = getLocalStorageItem('activeTab');
    activeTab = openedTabs?.find(tab => tab.fileId == activeTabId);
    console.log("File clicked event triggered: Explorer.tsx")
  }, [onFileClick]);

  async function getDirectoryContent(path: string): Promise<string[]> {
    try {
      return await invoke('get_files_and_subdirs', { path });
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async function fetchContent(directory: string) {
    const content = await getDirectoryContent(directory);

    content.sort((a, b) => {
      if (a.endsWith("/") && !b.endsWith("/")) {
        return -1;
      } else if (!a.endsWith("/") && b.endsWith("/")) {
        return 1;
      } else {
        return a.localeCompare(b);
      }
    });

    setContent(content);
  }

  async function readFileContent(file: string) {
    try {
      const content = await invoke('read_file_content', { path: `${directory}\\${file}` });
      return content;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  

  const handleFileClick = async (file: string) => {
    if (!directory) return;
    const fullPath = `${directory.replace(/[\\/]+$/, '')}\\${file}`;
    const content = await readFileContent(file);

    if (content !== null) {
      if (typeof content === 'string') {
        onFileClick(fullPath, content);
      }
    }
  };

  useEffect(() => {
    if (directory != null) {
      fetchContent(directory);
    }
  }, [directory]);

  return (
    <>
      {content.map((entry, index) => (
        <React.Fragment key={index}>
          {entry.endsWith("/") ? (
            <Accordion type="single" collapsible>
              <AccordionItem value={`item-${index}`}>
                <AccordionTrigger>
                  <div className={`inline-flex w-full items-center text-app-activetext space-x-2`} style={{ paddingLeft: `${level * 20}px` }} >
                    <FileDirectoryFillIcon size={13} />
                    <span>{entry.slice(0, -1)}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Explorer directory={`${directory}\\${entry}`} level={level + 1} onFileClick={onFileClick} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : (
            <button
              onClick={() => handleFileClick(entry)}
              className={`inline-flex ${activeTab?.fileName === entry || activeTab?.fileName === directory + "/" + entry ? 'bg-shadow-explorer' : 'bg-app-third'} w-full items-center text-app-activetext hover:bg-shadow-explorer`}
              style={{ paddingLeft: `${level * 20}px` }}
            >
              <DocumentTextIcon className="w-[14px] h-[14px] me-1" /> {entry}
            </button>
          )}
        </React.Fragment>
      ))}
    </>
  );
}

export default Explorer;
