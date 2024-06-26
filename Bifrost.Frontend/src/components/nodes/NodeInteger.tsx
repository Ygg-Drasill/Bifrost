import { NodeProps, Position } from "reactflow";
import MultiHandle from "../nodeLayout/MultiHandle";
import NodeBody from "../nodeLayout/NodeBody";
import { useEffect, useRef, useState } from "react";

export interface NodeIntegerData {
  onChange: (id:string, value: number) => void;
}

function NodeInteger(props: NodeProps<NodeIntegerData>) {
  const [value, setValue] = useState<string>("0");

  const firstUpdate = useRef(true);
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    
    if (props.data.onChange) props.data.onChange(props.id, parseInt(value));
  }, [value])
 
  return (
    <div className="node-title">
      <p>Integer</p>
      <div className="node-base">
        <NodeBody>
          <input 
            type="number"
            value={value}
            onChange={(e) => {setValue(e.target.value)}} 
          />
        </NodeBody>
        <MultiHandle
          type="source"
          position={Position.Right}
          ids={["value"]}
        />
      </div>
    </div>
  );
}

export default NodeInteger;
