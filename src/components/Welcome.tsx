import { Icons } from './Icons';
import { Toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button"

interface WelcomeProps {
  onFileOpen: () => void;
  onOpenFolderDialog: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onFileOpen, onOpenFolderDialog }) => {

  return (
    <div className="flex flex-col h-full w-screen justify-center items-center">
      <div className="text-[#151517] mb-24">{Icons.welcome}</div>
      <Button onClick={onFileOpen} className="h-16 w-96 flex justify-between items-center px-4 text-app-activetext text-base mb-2">
        <span className="text-left">Open file</span>
        <div className='text-right text-[#8999A8]'>
          <span className="bg-zinc-800 border border-zinc-700 shadow-md rounded-[5px] text-sm px-2">CTRL</span> + <span className="bg-zinc-800 border border-zinc-700 shadow-md rounded-[5px] text-sm px-2">O</span>
        </div>
      </Button>
      <Button onClick={onOpenFolderDialog} className="h-16 w-96 flex justify-between items-center px-4 text-app-activetext text-base mb-2">
        <span className="text-left">Create new project</span>
        <div className='text-right text-[#8999A8]'>
          <span className="bg-zinc-800 border border-zinc-700 shadow-md rounded-[5px] text-sm px-2">CTRL</span> + <span className="bg-zinc-800 border border-zinc-700 shadow-md rounded-[5px] text-sm px-2">P</span>
        </div>
      </Button>
      <Button onClick={onOpenFolderDialog} className="h-16 w-96 flex justify-between items-center px-4 text-app-activetext text-base mb-2">
        <span className="text-left">Open project/folder</span>
        <div className='text-right text-[#8999A8]'>
          <span className="bg-zinc-800 border border-zinc-700 shadow-md rounded-[5px] text-sm px-2">CTRL</span> + <span className="bg-zinc-800 border border-zinc-700 shadow-md rounded-[5px] text-sm px-2">K</span>
        </div>
      </Button>
      <Toaster />
    </div>
  );
};

export default Welcome;