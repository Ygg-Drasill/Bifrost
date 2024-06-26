import { DragEvent } from "react";
import "./toolbox.css";

function ToolBox() {
  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const nodes = [
    "integer",
    "compare",
    "arithmetic",
    "add",
    "subtract",
    "multiply",
    "divide",
    "modulo",
    "print",
    "ifstatement",
    "getMemory",
    "setMemory",
    "move"
  ]

  return (
    <div className="toolbox">
      <div className="node-list">
        {nodes.map((nodeType) => (
            <div
            className="toolbox-node-item"
            onDragStart={(event) => onDragStart(event, nodeType)}
            draggable
          >
            {nodeType.charAt(0).toUpperCase() + nodeType.slice(1)}
          </div>
        ))}
      </div>
      <div className="toolbox-footer">
        <a className="logo" href="https://github.com/Ygg-Drasill/Bifrost"></a>
        <h1>Bifrost</h1>
      </div>
    </div>
  );
}

export default ToolBox;
