import { Position } from "reactflow";
import MultiHandle from "../nodeLayout/MultiHandle";

function NodeMove() {
  return (
    <div className="node-title">
      <p>Move Creep</p>
      <div className="node-base">
        <MultiHandle type='target' position={Position.Left} ids={["direction"]} />
      </div>
    </div>
  );
}

export default NodeMove;
