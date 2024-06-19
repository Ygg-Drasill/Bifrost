import { Position } from "reactflow";
import MultiHandle from "../nodeLayout/MultiHandle";
import NodeBody from "../nodeLayout/NodeBody";

function NodeResult() {
  return (
    <div className="node-title">
        <p>Result Node</p>

    <div className="node-base">
    <MultiHandle type='target' position={Position.Left} ids={["text"]} />
      <NodeBody>
        <p>Result: </p>
      </NodeBody>
      </div>
    </div>
  );
}

export default NodeResult;
