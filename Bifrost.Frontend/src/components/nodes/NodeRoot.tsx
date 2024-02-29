import { Handle, Node, NodeProps, Position } from 'reactflow';

type NodeData = {
  value: number;
};

type NodeRoot = Node<NodeData>;

function NodeRoot({ data }: NodeProps<NodeData>) {
  return (
    <>
        <div>Start</div>
        <Handle type='source' position={Position.Right} />
    </>
)};

export default NodeRoot;