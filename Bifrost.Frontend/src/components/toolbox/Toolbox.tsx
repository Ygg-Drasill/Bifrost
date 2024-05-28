import "./toolbox.css"

function ToolBox() {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="toolbox">
      <div className="node-list">
        <div className="toolbox-node-item" onDragStart={event => onDragStart(event, "arit")} draggable>

        </div>
      </div>
      <a className="logo" href="https://github.com/Ygg-Drasill/Bifrost"></a>
    </div>
  );
}

export default ToolBox;