import { Position } from 'reactflow';
import MultiHandle from '../nodeLayout/MultiHandle';
import NodeBody from '../nodeLayout/NodeBody';


function NodeCompare() {
return (
    <div className='node-base'>
      <MultiHandle type='target' position={Position.Left} ids={["a", "b"]} />
      <NodeBody>
        <p>A</p>
        <select name="operator" id="operator" style={{height: "fit-content"}}>
          <option value="==">==</option>
          <option value="!=">!=</option>
          <option value=">">&lt;</option>
          <option value="<">&gt;</option>
        </select>
        <p>B</p>
      </NodeBody>
    
      <MultiHandle type='source' position={Position.Right} ids={["result"]} />
    </div>
)}

export default NodeCompare;