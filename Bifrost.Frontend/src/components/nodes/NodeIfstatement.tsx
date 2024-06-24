import { Position } from "reactflow";
import MultiHandle from "../nodeLayout/MultiHandle";
import NodeBody from "../nodeLayout/NodeBody";

function NodeIfstatement() {
  return (
    <div className="node-title">
        <p>If-statement</p>

    <div className="node-base">
      <MultiHandle type="target" position={Position.Left} ids={["a", "b"]} />
      <NodeBody>
        <p>If </p>
      </NodeBody>

      <MultiHandle
        type="source"
        position={Position.Right}
        ids={["C"]}
      />
      </div>
    </div>
  );
}

export default NodeIfstatement;
