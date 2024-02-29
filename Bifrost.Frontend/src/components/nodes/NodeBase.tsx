import { Node, NodeProps } from "reactflow";
import "./node.css";

type NodeData = {
    value: number;
  };

type NodeBase = Node<NodeData>;

function NodeBase({ data }: NodeProps<NodeData>) {
return (
    <div className="node-base">
        <label htmlFor="text">Text:</label>
        <input id="text" name="text" className="nodrag" />
    </div>
)};

export default NodeBase;