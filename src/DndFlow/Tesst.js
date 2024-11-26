import React, { useState } from 'react';
import ReactFlow, { Controls } from 'reactflow';
import 'reactflow/dist/style.css';

function FlowComponent() {
  const [nodes, setNodes] = useState([
    { id: '1', type: 'input', position: { x: 250, y: 0 }, data: { label: 'Node 1' } },
    { id: '2', type: 'output', position: { x: 250, y: 100 }, data: { label: 'Node 2' } },
    { id: '3', type: 'default', position: { x: 250, y: 200 }, data: { label: 'Node 3' } },
  ]);

  const [edges, setEdges] = useState([
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-3', source: '2', target: '3' },
  ]);

  // Hàm lưu flow vào file JSON
  const saveFlowToFile = () => {
    const flowData = { nodes, edges };
    const blob = new Blob([JSON.stringify(flowData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'flowData.json'; // Tên file sẽ được tải xuống
    link.click();
    URL.revokeObjectURL(url); // Giải phóng URL khi không còn sử dụng
  };

  // Hàm xử lý chọn thư mục (chỉ hỗ trợ trên một số trình duyệt)
  const handleDirectorySelect = (event) => {
    const files = event.target.files;
    // Thực hiện các thao tác với files trong thư mục đã chọn
    console.log(files);
  };

  return (
    <div style={{ height: '500px' }}>
      <button onClick={saveFlowToFile}>Lưu Flow vào File</button>

      {/* Dialog để chọn thư mục (chỉ hoạt động trên Chrome hoặc trình duyệt Webkit) */}
      <input 
        type="file" 
        webkitdirectory 
        onChange={handleDirectorySelect}
        style={{ marginTop: '10px' }}
      />
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        onNodesChange={(changes) => setNodes(changes)}
        onEdgesChange={(changes) => setEdges(changes)}
      >
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default FlowComponent;