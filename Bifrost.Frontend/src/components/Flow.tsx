import { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  FitViewOptions,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  NodeTypes,
  DefaultEdgeOptions,
  Background,
  MiniMap
} from 'reactflow';
 
import NodeRoot from './nodes/NodeRoot';
import NodeCompare from './nodes/NodeCompare';
import { useMutation } from 'react-query';
import axios from 'axios';
import './nodes/node.css';
 
const initialNodes: Node[] = [
  { id: '1', data: { label: 'Node 1' }, type: 'root', position: { x: 5, y: 5 } },
  { id: '2', data: { label: 'Node 2' }, type: 'compare', position: { x: 150, y: 5 } },
  { id: '3', data: { label: 'Node 3' }, type: 'compare', position: { x: 150, y: 150 } },
  { id: '4', data: { label: 'Node 4' }, type: 'compare', position: { x: 150, y: 300 } },
  { id: '5', data: { label: 'Node 5' }, type: 'compare', position: { x: 150, y: 450 } },
  { id: '6', data: { label: 'Node 6' }, type: 'compare', position: { x: 150, y: 600 } },
  { id: '7', data: { label: 'Node 7' }, type: 'compare', position: { x: 150, y: 750 } },
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

function Flow() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const nodeMutation = useMutation((nodes: Node[]) => {
    return axios.post('http://localhost:9000/update/nodes', nodes);
  });

  const edgeMutation = useMutation((edges: Edge[]) => {
    return axios.post('http://localhost:9000/update/edges', edges);
  });
 
const debouncedNodeMutation = useCallback(debounce(nodeMutation.mutate, 500), [nodeMutation.mutate]);
const debouncedEdgeMutation = useCallback(debounce(edgeMutation.mutate, 500), [edgeMutation.mutate]);

    useEffect(() => {
        debouncedNodeMutation(nodes)
    }, [debouncedNodeMutation, nodes]);

    useEffect(() => {
        debouncedEdgeMutation(edges)
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

  return (
    <ReactFlow
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
    >
      <MiniMap pannable />
      <Background color="#aaa" gap={16} />
    </ReactFlow>
    
  );
}

export default Flow;