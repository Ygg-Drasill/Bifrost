import { Position } from "reactflow";
import MultiHandle from "../nodeLayout/MultiHandle";

function NodeGetMemory() {
  return (
    <div className="node-title">
      <p>Get Memory</p>
      <div className="node-base">
        <MultiHandle type='source' position={Position.Right} ids={["value"]} />
      </div>
    </div>
  );
}

export default NodeGetMemory;
