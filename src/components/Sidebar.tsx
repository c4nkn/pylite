import { useEffect, useState } from "react";

// components & utils
import Explorer from "@/components/Explorer";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { Icons } from "./Icons";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { 
  FileDirectoryOpenFillIcon, 
  GearIcon, 
  ThreeBarsIcon, 
  WorkflowIcon 
} from "@primer/octicons-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Sidebar = ({ onFileClick, onCollapse }: { onFileClick: (file: string, content: string) => void, onCollapse: () => void}) => {
  const [activeTab, setActiveTab] = useState('explorer');
  const [sidebarTitle, setSidebarTitle] = useState('EXPLORER');
  const selectedDirectory = getLocalStorageItem<string>('openedFolder');

  useEffect(() => {
    console.log("File clicked event triggered: Sidebar.tsx")
  }, [onFileClick]);

  const onTabChange = (tabName: string) => {
    setActiveTab(tabName);

    switch (tabName) {
      case 'explorer':
        setSidebarTitle('EXPLORER');
        break;
      case 'documentation':
        setSidebarTitle('CHART & DIAGRAM GENERATOR');
        break;
      default:
        setSidebarTitle('EXPLORER');
    }
  }

  const explorerStruct = (directory: string | null) => {
    if (directory) {
      return (
        <div className="w-full">
          <Accordion type="single" defaultValue="selectedPath" collapsible>
            <AccordionItem value="selectedPath">
              <AccordionTrigger>
                <div className="inline-flex w-full items-center ms-3 space-x-2">
                  <span><FileDirectoryOpenFillIcon size={13} /></span>
                  <span>{directory.split(/[\\/]/).pop()}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Explorer directory={directory} level={1} onFileClick={onFileClick} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      );
    }
  };

  const types = [
    {
      id: "data-flow-diagram",
      label: "Data-flow Diagram",
    },
    {
      id: "flowchart",
      label: "Flowchart",
    },
    {
      id: "structure-chart",
      label: "Structure Chart",
    },
  ] as const

  const ChartAndDiagramGenerator = () => {
    return (
      <div className="w-full px-3 pt-6 space-y-10">
        <div className="space-y-2">
          <p className="text-sm text-app-inactivetext/75">PSEUDO CODE</p>
          <Textarea placeholder="Once you generated pseudo code will be shown here." />
          <Button className="h-10 w-full rounded-lg">
            GET 
          </Button>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-app-inactivetext/75">CHOOSE ONE</p>
          <RadioGroup defaultValue="data-flow-diagram">
            {types.map((type) => (
              <div className="flex flex-row items-center space-x-2">
                <RadioGroupItem value={type.label} id={type.id} />
                <span>{type.label}</span>
              </div>
            ))}
          </RadioGroup>
        </div>
        <Button className="h-10 w-full rounded-lg">
            GENERATE 
        </Button>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'explorer':
        return explorerStruct(selectedDirectory);
      case 'documentation':
        return ChartAndDiagramGenerator();
      default:
        setActiveTab('explorer');
        return null;
    }
  };

  return (
    <div className="flex flex-col bg-app-third h-full">
      <header className="h-10 w-full bg-app-fourth float-left items-center shadow-sm">
        <h3 className="float-left text-sm p-3 text-app-inactivetext tracking-widest truncate">
          {sidebarTitle}
        </h3>
        <div className="flex float-right p-2.5 space-x-2 items-center">
          <button className="bg-[#1E1E24]" >{Icons.swapArrows}</button>
          <button className="bg-[#1E1E24]" onClick={onCollapse}>{Icons.chevronDoubleL}</button>
        </div>
      </header>

      <div className="flex flex-1 overflow-auto">
        {renderContent()}
      </div>

      <footer className="flex h-10 bg-app-fourth grid grid-flow-col justify-stretch">
        <button
          className={`px-4 bg-app-fourth ${activeTab === 'explorer' ? 'active text-app-activetext border-b border-b-teal-400' : 'text-app-inactivetext'}`}
          onClick={() => onTabChange('explorer')}
        >
          <ThreeBarsIcon size={13} />
        </button>
        <button
          className={`px-4 bg-app-fourth ${activeTab === 'documentation' ? 'active text-app-activetext border-b border-b-teal-400' : 'text-app-inactivetext'}`}
          onClick={() => onTabChange('documentation')}
        >
          <WorkflowIcon size={13} />
        </button>
        <button
          className={`px-4 bg-app-fourth ${activeTab === 'settings' ? 'active text-app-activetext border-b border-b-teal-400' : 'text-app-inactivetext'}`}
        >
          <GearIcon size={16} />
        </button>
      </footer>
    </div>
  );
};

export default Sidebar;