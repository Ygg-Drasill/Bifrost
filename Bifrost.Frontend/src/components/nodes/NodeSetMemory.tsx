import { Position } from "reactflow";
import MultiHandle from "../nodeLayout/MultiHandle";

function NodeSetMemory() {
  return (
    <div className="node-title">
      <p>Set Memory</p>
      <div className="node-base">
        <MultiHandle type='target' position={Position.Left} ids={["value"]} />
      </div>
    </div>
  );
}

export default NodeSetMemory;
