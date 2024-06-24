import { Position } from "reactflow";
import MultiHandle from "../nodeLayout/MultiHandle";
import NodeBody from "../nodeLayout/NodeBody";

function NodeArithmetic() {
  return (
    <div className="node-title">
        <p>Arithmetic</p>
    <div className="node-base">
      <MultiHandle type="target" position={Position.Left} ids={["a", "b"]} />
      <NodeBody>
        <p>A</p>
        <select name="operator" id="operator" style={{ height: "fit-content" }}>
          <option value="add"> + </option>
          <option value="sub"> - </option>
          <option value="div"> / </option>
          <option value="mul"> * </option>
        </select>
        <p>B</p>
      </NodeBody>

      <MultiHandle
        type="source"
        position={Position.Right}
        ids={["result"]}
      />
      </div>
    </div>
  );
}

export default NodeArithmetic;
