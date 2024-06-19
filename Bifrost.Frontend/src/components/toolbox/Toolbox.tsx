import "./toolbox.css";

function ToolBox() {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="toolbox">
      <div className="toolbox-logo">
      <a className="logo" href="https://github.com/Ygg-Drasill/Bifrost"></a>
      <h1>Toolbox</h1>
      </div>  

      <div className="node-list">
      <div
          className="toolbox-node-item"
          onDragStart={(event) => onDragStart(event, "declare")}
          draggable
        >Declare Node</div>
        <div
          className="toolbox-node-item"
          onDragStart={(event) => onDragStart(event, "compare")}
          draggable
        >Compare Node</div>
          <div
            className="toolbox-node-item"
            onDragStart={(event) => onDragStart(event, "arithmetic")}
            draggable
          >Arithmetic Node</div>
          <div
            className="toolbox-node-item"
            onDragStart={(event) => onDragStart(event, "result")}
            draggable
          >Result Node</div>
      </div>
    </div>
  );
}

export default ToolBox;
