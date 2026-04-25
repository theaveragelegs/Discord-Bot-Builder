import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import { NODE_DEFINITIONS } from '../nodes/index';

const PORT_COLORS = {
  action: '#57f287', text: '#9b59b6', user: '#3498db', member: '#f1c40f',
  channel: '#e67e22', server: '#e74c3c', message: '#1abc9c', number: '#ecf0f1',
  boolean: '#e91e63', interaction: '#5865f2', role: '#2ecc71', any: '#99aab5',
  embed: '#ff6b6b', component: '#a29bfe',
};

function getPortDataType(node, handleId, handleType) {
  const def = NODE_DEFINITIONS[node.type];
  if (!def) return 'any';
  const rawPorts = handleType === 'source' ? def.outputs : def.inputs;
  const ports = typeof rawPorts === 'function' ? rawPorts(node.data || {}) : (rawPorts || []);
  const port = ports.find((p) => p.id === handleId);
  return port?.dataType || 'any';
}

function canConnect(sourceType, targetType) {
  if (sourceType === 'any' || targetType === 'any') return true;
  return sourceType === targetType;
}

const MAX_HISTORY = 50;

const useFlowStore = create((set, get) => ({
  nodes: [],
  edges: [],
  history: [],
  future: [],

  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes),
    }));
  },

  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    }));
  },

  onConnect: (connection) => {
    const { nodes } = get();
    let { source, sourceHandle, target, targetHandle } = connection;
    
    const actualSourceNode = nodes.find((n) => n.id === source);
    const actualTargetNode = nodes.find((n) => n.id === target);

    const sourceDataType = getPortDataType(actualSourceNode, sourceHandle, 'source');
    const targetDataType = getPortDataType(actualTargetNode, targetHandle, 'target');

    // Validate connection types
    if (!canConnect(sourceDataType, targetDataType)) return;

    const edgeColor = PORT_COLORS[sourceDataType] || PORT_COLORS.any;

    set((state) => ({
      edges: addEdge(
        {
          ...connection,
          source,
          sourceHandle,
          target,
          targetHandle,
          animated: sourceDataType === 'action',
          style: { stroke: edgeColor, strokeWidth: 2 },
          data: { dataType: sourceDataType },
        },
        state.edges
      ),
    }));
  },

  // Validate if a connection is allowed (used by ReactFlow isValidConnection)
  isValidConnection: (connection) => {
    const { nodes } = get();
    let { source, sourceHandle, target, targetHandle } = connection;
    
    const actualSourceNode = nodes.find((n) => n.id === source);
    const actualTargetNode = nodes.find((n) => n.id === target);
    if (!actualSourceNode || !actualTargetNode) return false;

    const sourceDataType = getPortDataType(actualSourceNode, sourceHandle, 'source');
    const targetDataType = getPortDataType(actualTargetNode, targetHandle, 'target');
    return canConnect(sourceDataType, targetDataType);
  },

  addNode: (node) => {
    const state = get();
    get().pushHistory();
    set({ nodes: [...state.nodes, { ...node, className: 'animate-node-appear' }] });
  },

  removeNode: (nodeId) => {
    get().pushHistory();
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== nodeId),
      edges: state.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
    }));
  },

  updateNodeData: (nodeId, data) => {
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
      ),
    }));
  },

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  loadFlow: (nodes, edges) => {
    set({ nodes, edges, history: [], future: [] });
  },

  clearFlow: () => {
    get().pushHistory();
    set({ nodes: [], edges: [] });
  },

  // Undo/Redo
  pushHistory: () => {
    const { nodes, edges, history } = get();
    const newHistory = [...history, { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }];
    if (newHistory.length > MAX_HISTORY) newHistory.shift();
    set({ history: newHistory, future: [] });
  },

  undo: () => {
    const { history, nodes, edges } = get();
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    set({
      nodes: prev.nodes,
      edges: prev.edges,
      history: history.slice(0, -1),
      future: [{ nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }, ...get().future],
    });
  },

  redo: () => {
    const { future, nodes, edges } = get();
    if (future.length === 0) return;
    const next = future[0];
    set({
      nodes: next.nodes,
      edges: next.edges,
      future: future.slice(1),
      history: [...get().history, { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }],
    });
  },

  // Get the flow data for saving
  getFlowData: () => {
    const { nodes, edges } = get();
    return { nodes, edges };
  },
}));

export default useFlowStore;
