import { NodeProps } from "reactflow";
import "./node.css";

function NodeBase({ data }: NodeProps<NodeData>) {
    return (
        <div className="node-base">
            <label htmlFor="text">Text:</label>
            <input id="text" name="text" className="nodrag" />
        </div>
    );
}

export default NodeBase;