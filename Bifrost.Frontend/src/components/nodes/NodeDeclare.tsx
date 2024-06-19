import { Position } from "reactflow";
import MultiHandle from "../nodeLayout/MultiHandle";
import NodeBody from "../nodeLayout/NodeBody";

function NodeDeclare() {
  return (
    <div className="node-title">
        <p>Declare Node</p>

    <div className="node-base">
      <NodeBody>
        <input placeholder="Variable" name="DeclareVariable"  />
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
