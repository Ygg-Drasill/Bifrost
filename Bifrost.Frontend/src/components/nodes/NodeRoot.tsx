import { Handle, Position } from 'reactflow';

function NodeRoot() {
return (
    <div className='node-base node-round-right' style={{backgroundColor: "#ecffed", borderColor: "#99eeaa", color: "#99eeaa"}}>
      <span>▶</span>
      <Handle type="source" id='out' position={Position.Right} />
    </div>
)}

export default NodeRoot;