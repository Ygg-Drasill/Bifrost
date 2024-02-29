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
  DefaultEdgeOptions
} from 'reactflow';
 
import NodeRoot from './nodes/NodeRoot';
import { useMutation } from 'react-query';
import axios from 'axios';
 
const initialNodes: Node[] = [
  { id: '1', data: { label: 'Node 1' }, position: { x: 5, y: 5 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 5, y: 100 } }, 
  { id: '3', data: { label: 'Node 3' }, type: 'root', position: { x: 5, y: 150 } },
];
 
const initialEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2' }];
 
const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};
 
const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
};
 
const nodeTypes: NodeTypes = {
  root: NodeRoot,
};

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
    }, [nodes]);

    useEffect(() => {
        debouncedEdgeMutation(edges)
    }, [edges]);
 
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
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
    />
  );
}

export default Flow;