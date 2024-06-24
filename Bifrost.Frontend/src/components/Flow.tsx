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
import NodeDeclare from "./nodes/NodeDeclare";
import NodeIfstatement from './nodes/NodeIfstatement';
import NodeResult from './nodes/NodeResult';
import NodeRoot from './nodes/NodeRoot';
import './nodes/node.css';

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
  root: NodeRoot,
  compare: NodeCompare,
  arithmetic: NodeArithmetic,
  declare: NodeDeclare,
  result: NodeResult,
  ifstatement: NodeIfstatement,
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
  data: any;
};

export type YggEdge = {
  source: string;
  target: string;
};

function mapToYggNode(node: Node): YggNode {
  if (!node.type) {
    throw new Error(`Node type is not defined for node with id ${node.id}`);
  }
  return {
    id: node.id,
    nodeType: node.type,
    data: node.data,
  };
}

function mapToYggEdge(edge: Edge): YggEdge {
  return {
    source: edge.source,
    target: edge.target,
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

  const nodeMutation = useMutation((nodes: YggNode[]) => {
    return axios.post('http://localhost:9000/update/nodes', nodes, { headers: { 'Content-Type': 'application/json' } });
  });

  const edgeMutation = useMutation((edges: YggEdge[]) => {
    return axios.post('http://localhost:9000/update/edges', edges, { headers: { 'Content-Type': 'application/json' } });
  });

  const debouncedNodeMutation = useCallback(debounce(nodeMutation.mutate, 500), [nodeMutation.mutate]);
  const debouncedEdgeMutation = useCallback(debounce(edgeMutation.mutate, 500), [edgeMutation.mutate]);

  useEffect(() => {
    setYggNodes(nodes.map(mapToYggNode));
    debouncedNodeMutation(yggNodes);
  }, [debouncedNodeMutation, nodes]);

  useEffect(() => {
    setYggEdges(edges.map(mapToYggEdge));
    debouncedEdgeMutation(yggEdges);
  }, [debouncedEdgeMutation, edges]);

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
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance],
  );

  const updateNodeData = (id: string, newData: { result: any; }) => {
    //console.log(`Updating node ${id} with data:`, newData); // Debugging line
    setNodes((nodes) =>
      nodes.map((node) => (node.id === id ? { ...node, data: { ...node.data, ...newData } } : node))
    );
  };

  const calculateResults = () => {
    const declareNode = nodes.find((node) => node.type === 'declare');
    const resultNode = nodes.find((node) => node.type === 'result');

    if (declareNode && resultNode) {
      const value = declareNode.data.value;
      updateNodeData(resultNode.id, { result: value });
    }
  };

  useEffect(() => {
    calculateResults();
  }, [nodes, edges]);

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
