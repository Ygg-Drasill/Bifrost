import { Position } from "reactflow";
import MultiHandle from "../nodeLayout/MultiHandle";

function NodeDivide() {
  return (
    <div className="node-title">
      <p>Divide</p>
      <div className="node-base">
        <MultiHandle type='target' position={Position.Left} ids={["a", "b"]} />
        <MultiHandle type='source' position={Position.Right} ids={["result"]} />
      </div>
    </div>
  );
}

export default NodeDivide;
