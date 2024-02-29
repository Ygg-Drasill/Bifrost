import { Handle, Node, NodeProps, Position } from 'reactflow';

function NodeRoot() {
return (
    <div className='node-base' style={{backgroundColor: "#ecffed", borderColor: "#99eeaa"}}>
      <span>Root</span>
      <Handle type="source" position={Position.Right} />
    </div>
)};

export default NodeRoot;