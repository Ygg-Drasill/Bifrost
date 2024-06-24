import { DragEvent } from "react";
import "./toolbox.css";

function ToolBox() {
  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const nodes = [
    "declare",
    "compare",
    "arithmetic",
    "add",
    "subtract",
    "multiply",
    "divide",
    "print",
    "ifstatement",
  ]

  return (
    <div className="toolbox">
      <div className="toolbox-logo">
        <a className="logo" href="https://github.com/Ygg-Drasill/Bifrost"></a>
        <h1>Toolbox</h1>
      </div>

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
    </div>
  );
}

export default ToolBox;
