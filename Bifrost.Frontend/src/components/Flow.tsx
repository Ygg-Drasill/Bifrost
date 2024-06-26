import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import ReactFlow, {
  Background,
  Controls,
  DefaultEdgeOptions,
  Edge,
  FitViewOptions,
  MiniMap,
  Node,
  NodeTypes,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  ReactFlowInstance,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges
} from 'reactflow';
import NodeArithmetic from './nodes/NodeArithmetic';
import NodeCompare from './nodes/NodeCompare';
import NodeInteger, { NodeIntegerData } from "./nodes/NodeInteger";
import NodeIfstatement from './nodes/NodeIfstatement';
import NodeResult from './nodes/NodeResult';
import './nodes/node.css';
import NodeAdd from './nodes/NodeAdd';
import NodeSubtract from './nodes/NodeSub';
import NodeDivide from './nodes/NodeDivide';
import NodeMultiply from './nodes/NodeMultiply';
import NodeModulo from './nodes/NodeModulo';
import NodeGetMemory from './nodes/NodeGetMemory';
import NodeSetMemory from './nodes/NodeSetMemory';
import NodeMove from './nodes/NodeMove';

const initialNodes: Node[] = [
];

const initialEdges: Edge[] = [];

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
};

const nodeTypes: NodeTypes = {
  compare: NodeCompare,
  arithmetic: NodeArithmetic,
  integer: NodeInteger,
  print: NodeResult,
  ifstatement: NodeIfstatement,
  add: NodeAdd,
  subtract: NodeSubtract,
  divide: NodeDivide,
  multiply: NodeMultiply,
  modulo: NodeModulo,
  setMemory: NodeSetMemory,
  getMemory: NodeGetMemory,
  move: NodeMove,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced as (...args: Parameters<F>) => ReturnType<F>;
};

export type YggNode = {
  id: string;
  nodeType: string;
  data?: object;
};

export type YggEdge = {
  sourceId: string;
  sourceVar: string;
  targetId: string;
  targetVar: string;
};

function mapToYggNode(node: Node): YggNode {
  if (!node.type) {
    throw new Error(`Node type is not defined for node with id ${node.id}`);
  }
  return {
    data: node.data,
    id: node.id,
    nodeType: node.type,
  };
}

function mapToYggEdge(edge: Edge): YggEdge {
  return {
    sourceId: edge.source,
    sourceVar: edge.sourceHandle || '',
    targetId: edge.target,
    targetVar: edge.targetHandle || '',
  };
}

let id = 1;
const getId = () => `${id++}`;

function Flow() {
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance>();

  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const [yggNodes, setYggNodes] = useState<YggNode[]>([]);
  const [yggEdges, setYggEdges] = useState<YggEdge[]>([]);

  const updateMutation = useMutation((state: {nodes: YggNode[], edges: YggEdge[]}) => {
    return axios.post('http://localhost:9000/update', 
      state,
      { headers: { 'Content-Type': 'application/json' } });
  });

  const debouncedNodeMutation = useCallback(debounce(updateMutation.mutate, 500), [updateMutation.mutate]);

  useEffect(() => {
    setYggNodes(nodes.map(mapToYggNode));
    setYggEdges(edges.map(mapToYggEdge));
  }, [edges, nodes]);

  useEffect(() => {
    console.log(nodes);
    const updatedNodes = nodes.map((node) => {
      if (node.type === 'integer') {
        node.data = {
          ...node.data,
          onChange: (id: string, value: number) => {
            console.log(value);
            
            const updatedNodes = nodes.map((n) => {
              if (n.id === id) {
                n.data = {
                  ...n.data,
                  value,
                };
              }
              return n;
            });
            setNodes(updatedNodes);
          },
        }
      }
      return node
    });
    setNodes(updatedNodes);
  }, [nodes.length])

  useEffect(() => {
    if (edges.length > 0) {
      debouncedNodeMutation({nodes: yggNodes, edges: yggEdges});
    }
  },[yggNodes, yggEdges, debouncedNodeMutation])

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nodes) => applyNodeChanges(changes, nodes)),
    [setNodes],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((edges) => applyEdgeChanges(changes, edges)),
    [setEdges],
  );

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges],
  );

  const onDragOverCallback = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    if (event.dataTransfer == null) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDropCallback = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      const nodeId = getId()
      let typeData: NodeIntegerData | undefined = undefined;

      if (reactFlowInstance == undefined) return;
      if (event.dataTransfer == null) return;
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: nodeId,
        type,
        position,
        data: { label: `${type} node`, value: 0, ...typeData},
      };
      setNodes((nodes) => nodes.concat(newNode));
    },
    [reactFlowInstance, yggNodes],
  );

  return (
    <ReactFlow
      onInit={setReactFlowInstance}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
      fitViewOptions={fitViewOptions}
      defaultEdgeOptions={defaultEdgeOptions}
      nodeTypes={nodeTypes}
      zoomOnDoubleClick={true}
      onDragOver={onDragOverCallback}
      onDrop={onDropCallback}
    >
      <MiniMap pannable />
      <Background color="#aaa" gap={16} />
      <Controls />
    </ReactFlow>
  );
}

export default Flow;
