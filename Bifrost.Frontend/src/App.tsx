import 'reactflow/dist/style.css';
import './App.css';
import Flow from './components/Flow';
import ToolBox from './components/toolbox/Toolbox';

export default function App() {
  return (
    <div className="app">
      <ToolBox />
      <Flow />
    </div>
  );
}