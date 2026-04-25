import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  ConnectionMode,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { nodeTypes, NODE_DEFINITIONS } from '../../nodes/index';
import useFlowStore from '../../store/flowStore';
import useUIStore from '../../store/uiStore';
import ContextMenu from './ContextMenu';

const MINIMAP_NODE_COLOR = (node) => {
  const colors = {
    event: '#5865f2',
    action: '#57f287',
    logic: '#fee75c',
    variable: '#ed4245',
    discord: '#eb459e',
    utility: '#99aab5',
  };
  return colors[node.data?.category] || '#99aab5';
};

export default function FlowEditor() {
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();

  const nodes = useFlowStore((s) => s.nodes);
  const edges = useFlowStore((s) => s.edges);
  const onNodesChange = useFlowStore((s) => s.onNodesChange);
  const onEdgesChange = useFlowStore((s) => s.onEdgesChange);
  const onConnect = useFlowStore((s) => s.onConnect);
  const addNode = useFlowStore((s) => s.addNode);
  const isValidConnection = useFlowStore((s) => s.isValidConnection);

  const selectedNodeId = useUIStore((s) => s.selectedNodeId);
  const setSelectedNode = useUIStore((s) => s.setSelectedNode);
  const contextMenu = useUIStore((s) => s.contextMenu);
  const setContextMenu = useUIStore((s) => s.setContextMenu);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node.id);
  }, [setSelectedNode]);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setContextMenu(null);
  }, [setSelectedNode, setContextMenu]);

  const onPaneContextMenu = useCallback((event) => {
    event.preventDefault();
    const bounds = reactFlowWrapper.current?.getBoundingClientRect();
    setContextMenu({
      x: event.clientX - (bounds?.left || 0),
      y: event.clientY - (bounds?.top || 0),
    });
  }, [setContextMenu]);

  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    const bounds = reactFlowWrapper.current?.getBoundingClientRect();
    setContextMenu({
      x: event.clientX - (bounds?.left || 0),
      y: event.clientY - (bounds?.top || 0),
      nodeId: node.id,
    });
  }, [setContextMenu]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow/type');
    const label = event.dataTransfer.getData('application/reactflow/label');
    if (!type) return;

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const nodeDef = NODE_DEFINITIONS[type] || {};
    const defaultData = nodeDef.settings?.reduce((acc, setting) => {
      acc[setting.key] = setting.default !== undefined ? setting.default : '';
      return acc;
    }, {}) || {};

    const newNode = {
      id: `${type}_${Date.now()}`,
      type,
      position,
      data: { label, ...defaultData },
    };

    addNode(newNode);
  }, [screenToFlowPosition, addNode]);

  return (
    <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onPaneContextMenu={onPaneContextMenu}
        onNodeContextMenu={onNodeContextMenu}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        isValidConnection={isValidConnection}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: '#5865f2', strokeWidth: 2 },
        }}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
        minZoom={0.1}
        maxZoom={2}
        deleteKeyCode={['Backspace', 'Delete']}
        multiSelectionKeyCode="Shift"
        selectionKeyCode="Shift"
        colorMode="dark"
        connectionMode={ConnectionMode.Loose}
        connectionRadius={30}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="rgba(255,255,255,0.04)" />
        <Controls
          showInteractive={false}
          style={{ bottom: 20, left: 20 }}
        />
        <MiniMap
          nodeColor={MINIMAP_NODE_COLOR}
          nodeStrokeWidth={2}
          style={{ bottom: 20, right: 20, width: 160, height: 100 }}
          maskColor="rgba(0,0,0,0.6)"
        />
      </ReactFlow>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          nodeId={contextMenu.nodeId}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
