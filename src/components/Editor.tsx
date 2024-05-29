import { useEffect, useState } from "react";
import { Editor as Monaco } from '@monaco-editor/react';
import { MonacoBreakpoint } from 'monaco-breakpoints';
import { invoke } from "@tauri-apps/api";

import { Icons } from "./Icons";
import Terminal from "./Terminal";
import Default from "../themes/default.json";
import { CommandPaletteIcon } from "@primer/octicons-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";

const Editor = ({ fileName, fileContent }: { fileName: string | null, fileContent: string | null }) => {
  const [isTerminalOpen, setTerminalState] = useState(false);
  const [currentPosition, setCurrentPosition] = useState({ lineNumber: 1, column: 1 });
  const [pythonVersion, setPythonVersion] = useState('');
  const [pythonExecPath, setPythonExecPath] = useState('');
  const [runCommand, setRunCommand] = useState('');

  useEffect(() => {
    invoke<string>('get_python_version')
      .then((version) => setPythonVersion(version.trim()))
      .catch((error) => console.error('Error occurred while fetching Python version: ', error));

    invoke<string>('get_python_exec_path')
      .then((path) => setPythonExecPath(path.trim()))
      .catch((error) => console.error('Error occurred while fetching Python executable path: ', error));
  }, []);

  const toggleTerminal = () => {
    setTerminalState(!isTerminalOpen);
  };

  const handleRunScript = () => {
    if (pythonExecPath && fileName) {
      const command = `${pythonExecPath} ${fileName}`;
      const commandWithId = `${command}#${new Date().getTime()}`;
  
      if (command) {
        setRunCommand(commandWithId);
        setTerminalState(true);
      }
    }
  };

  const handleCommandExecuted = () => {
    setRunCommand('');
  };

  function handleEditorDidMount(editor: any, monaco: any) {
    const instance = new MonacoBreakpoint({ editor });

    monaco.editor.defineTheme('default', Default);
    monaco.editor.setTheme('default');

    instance.on('breakpointChanged', breakpoints => {
      console.log('breakpointChanged: ', breakpoints);
    });

    const position = editor.getPosition();
    if (position) {
      setCurrentPosition({ lineNumber: position.lineNumber, column: position.column });
    }

    editor.onDidChangeCursorPosition((e: any) => {
      const newPosition = e.position;
      setCurrentPosition({ lineNumber: newPosition.lineNumber, column: newPosition.column });
    });
  };

  return (
    <div className="h-full w-full flex flex-col">
      {/* Tab Area */}
      <header className="flex h-10 bg-app-fourth">
        <div className="inline-flex tabs w-[95vw]">
          <div className="float-left">
            <button className={`flex border-t border-t-cyan-500 text-app-activetext bg-app-primary items-center px-3 py-1.5 border-r border-[#2E2E32]`}>
              {fileName || 'Untitled-1'}
              <button className={`closebtn ms-1 text-red-500 hover:bg-shadow-tab rounded-xl bg-app-primary`}>
                {Icons.fileClose}
              </button>
            </button>
          </div>
        </div>
        <div className="inline-flex items-center w-[5vw]">
          <button onClick={handleRunScript}>
            <svg height="16px" width="16px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3 3.732a1.5 1.5 0 0 1 2.305-1.265l6.706 4.267a1.5 1.5 0 0 1 0 2.531l-6.706 4.268A1.5 1.5 0 0 1 3 12.267V3.732Z" />
            </svg>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-auto">
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel className="h-full !overflow-auto" defaultSize={65} minSize={50}>
            <Monaco
              theme="vs-dark"
              defaultLanguage="python"
              value={fileContent as string}
              onMount={handleEditorDidMount}
              options={{
                automaticLayout: true,
                minimap: {
                  enabled: false,
                },
                glyphMargin: true,
              }}
            />
          </ResizablePanel>
          {/* Terminal Section */}
          <ResizableHandle />
          <ResizablePanel className={`w-full bg-app-secondary/25 p-3 space-y-4 border-t border-t-app-border ${isTerminalOpen ? 'block' : 'hidden'}`} defaultSize={35} minSize={20}>
            <div className="flex flex-row h-8 w-full border-b border-app-border p-1 justify-between">
              <button className="bg-app-secondary/25 text-sm text-app-inactivetext tracking-widest truncate hover:text-app-activetext">
                CONSOLE
              </button>
              <button onClick={toggleTerminal} className="float-end">
                X
              </button>
            </div>
            <Terminal command={runCommand} onCommandExecuted={handleCommandExecuted} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <footer className="flex h-10 bg-app-secondary items-center px-3">
        <div className="ms-0">
          <button onClick={toggleTerminal}
            className={`flex h-10 px-2 text-app-activetext items-center space-x-2 ${isTerminalOpen ? 'bg-shadow-controls text-white focus:bg-shadow-controls' : 'bg-app-secondary'
              } hover:bg-shadow-controls`}
          >
            <CommandPaletteIcon size={13} />
            <span>Terminal</span>
          </button>
        </div>
        <div className="ml-auto space-x-6">
          <span>Ln {currentPosition.lineNumber}, Col {currentPosition.column}</span>
          <span>{pythonVersion}</span>
        </div>
      </footer>
    </div>
  );
}

export default Editor;