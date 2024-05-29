import { useEffect, useRef } from "react";

// dependencies
import { Terminal as Term } from "xterm";
import { FitAddon } from 'xterm-addon-fit';
import "xterm/css/xterm.css";
import { spawn } from "tauri-pty";
import { getLocalStorageItem } from "@/utils/LocalStorage";

const Terminal = ({ command, onCommandExecuted }: { command: string, onCommandExecuted: () => void }) => {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const ptyRef = useRef<any>(null);
  const commandRef = useRef<string>('');
  let openedFolder = getLocalStorageItem('openedFolder');

  useEffect(() => {
    if (command !== '' && ptyRef.current && command !== commandRef.current) {
      const actualCommand = command.split('#')[0];
      ptyRef.current.write(actualCommand + "\r\n");
      commandRef.current = command;
      onCommandExecuted();
    }
  }, [command, onCommandExecuted]);

  useEffect(() => {
    const terminal = new Term({
      fontFamily: "Geist Mono",
      fontSize: 12,
      theme: {
        background: "rgba(23, 23, 25, 0.25)",
      },
    });

    const pty = spawn("powershell.exe", [], {
      cols: terminal.cols,
      rows: terminal.rows,
      cwd: openedFolder as string,
    });

    ptyRef.current = pty;

    if(terminalRef.current) {
      const fitAddon = new FitAddon();
      terminal.loadAddon(fitAddon);
      fitAddon.fit();
      terminal.open(terminalRef.current);
      pty.onData(data => terminal.write(data));
      terminal.onData(data => pty.write(data));
      pty.onExit(({ exitCode }) => { terminal.write(`\n\nProgram exit: ${exitCode}`); });
    }

    return () => {
      terminal.dispose();
      pty.clear();
      pty.kill();
    };
  }, []);

  return <div ref={terminalRef} className="w-full h-full" />;
}

export default Terminal;
