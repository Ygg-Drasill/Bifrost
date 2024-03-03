import { Handle, HandleType, Position } from "reactflow";
import './nodeLayout.css';

interface MultiHandleProps {
    type: HandleType;
    position: Position;
    ids: string[];
}

function MultiHandle(props: MultiHandleProps) {
    return (
    <div className="multi-handle">
        {props.position == Position.Left 
            ? props.ids.map((id) => (
            <div key={"handle-"+id} className="handle-and-label">
                <Handle type={props.type} position={props.position} id={id}/>
                <p>{id.toUpperCase()}</p>
            </div>
            ))
            : props.ids.map((id) => (
            <div key={"handle-"+id} className="handle-and-label">
                <p>{id.toUpperCase()}</p>
                <Handle type={props.type} position={props.position} id={id}/>
            </div>
            ))
        }
    </div>
    )
}

export default MultiHandle;