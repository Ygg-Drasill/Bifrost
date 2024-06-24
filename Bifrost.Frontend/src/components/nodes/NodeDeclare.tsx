import { ChangeEvent, useEffect, useState } from "react";
import { Position } from "reactflow";
import MultiHandle from "../nodeLayout/MultiHandle";
import NodeBody from "../nodeLayout/NodeBody";

interface NodeDeclareData {
  value?: string | number;
}

interface NodeDeclareProps {
  id: string;
  data: NodeDeclareData;
}

function NodeDeclare({ id, data }: NodeDeclareProps) {
  const [inputValue, setInputValue] = useState<string>(data.value?.toString() || "1");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^0-9]/g, '');
    setInputValue(value);
    console.log(`NodeDeclare: updating node ${id} with value ${value}`); // Debugging line
  };

  useEffect(() => {
    setInputValue(data.value?.toString() || "1");
  }, [data]);

  return (
    <div className="node-title">
      <p>Declare</p>
      <div className="node-base">
        <NodeBody>
          <input 
            type="text" 
            value={inputValue} 
            onChange={handleInputChange} 
          />
        </NodeBody>
        <MultiHandle
          type="source"
          position={Position.Right}
          ids={["a"]}
        />
      </div>
    </div>
  );
}

export default NodeDeclare;
