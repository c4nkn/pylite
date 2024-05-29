import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";

interface MenuProps {
  onOpenFolderDialog: () => void;
  closeFolder: () => void;
  isFileOpened: string | null;
  isFolderOpened: string | null;
}

const Menu: React.FC<MenuProps> = ({ onOpenFolderDialog, closeFolder, isFileOpened, isFolderOpened }) => {
  return (
    <Menubar>
      {/* File Menu */}
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New File <MenubarShortcut>Ctrl+N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New window
            <MenubarShortcut>Ctrl+T</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Open file <MenubarShortcut>Ctrl+O</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={onOpenFolderDialog}>
            Open project/folder <MenubarShortcut>Ctrl+K</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem disabled={!isFolderOpened}>
            Save <MenubarShortcut>Ctrl+S</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled={!isFileOpened || !isFolderOpened}>
            Save As <MenubarShortcut>Ctrl+Shift+S</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={closeFolder} disabled={!isFolderOpened}>
            Close Folder <MenubarShortcut>Ctrl+K F</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      {/* Edit Menu */}
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo <MenubarShortcut>Ctrl+Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo
            <MenubarShortcut>Ctrl+Y</MenubarShortcut>
          </MenubarItem>

          <MenubarSeparator />

          <MenubarItem>
            Cut  <MenubarShortcut>Ctrl+X</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Copy <MenubarShortcut>Ctrl+C</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Paste <MenubarShortcut>Ctrl+V</MenubarShortcut>
          </MenubarItem>

          <MenubarSeparator />

          <MenubarItem>
            Find <MenubarShortcut>Ctrl+F</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Replace <MenubarShortcut>Ctrl+H</MenubarShortcut>
          </MenubarItem>

          <MenubarSeparator />

          <MenubarItem>
            Find in Files <MenubarShortcut>Ctrl+Shift+F</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Replace in Files <MenubarShortcut>Ctrl+Shift+H</MenubarShortcut>
          </MenubarItem>

          <MenubarSeparator />

          <MenubarItem>
            Toggle Line Comment <MenubarShortcut>Ctrl+Ö</MenubarShortcut>
          </MenubarItem>

        </MenubarContent>
      </MenubarMenu>

      {/* Run Menu */}
      <MenubarMenu>
        <MenubarTrigger>Run</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Start Debugging <MenubarShortcut>F5</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Run Without Debugging
            <MenubarShortcut>Ctrl+F5</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Stop Debugging  <MenubarShortcut>Shift+F5</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Restart Debugging <MenubarShortcut>Ctrl+Shift+F5</MenubarShortcut>
          </MenubarItem>

          <MenubarSeparator />

          <MenubarItem>
            Step Over <MenubarShortcut>F10</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Step Into <MenubarShortcut>F11</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Step Out <MenubarShortcut>Shift+F11</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Continue <MenubarShortcut>F5</MenubarShortcut>
          </MenubarItem>

          <MenubarSeparator />

          <MenubarItem>
            Enable All Breakpoints
          </MenubarItem>
          <MenubarItem>
            Disable All Breakpoints
          </MenubarItem>
          <MenubarItem>
            Remove All Breakpoints
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      {/* Terminal Menu */}
      <MenubarMenu>
        <MenubarTrigger>Terminal</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Open Terminal <MenubarShortcut>Ctrl+Shift+"</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

    </Menubar>
  )
}

export default Menu;