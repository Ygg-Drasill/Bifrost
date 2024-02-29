import 'reactflow/dist/style.css';
import Flow from './components/Flow';
import './App.css';
import ToolBox from './components/toolbox/Toolbox';

export default function App() {
  return (
    <div className="app">
      <ToolBox />
      <Flow />
    </div>
  );
}