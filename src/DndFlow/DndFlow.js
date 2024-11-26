import React, { useRef, useCallback, useState, useEffect } from 'react'; // from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  Background
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import Sidebar from './Sidebar';
import { DnDProvider, useDnD } from './DnDContext';
import '@xyflow/react/dist/style.css';
import './index.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const initialNodes = [
  {
    id: '1',
    type: 'block',
    data: { label: 'block node' },
    position: { x: 250, y: 5 },
    sourcePosition: 'right',
  },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  //const [sourcePos, setSourcePos] = useState('right');    

  const { screenToFlowPosition } = useReactFlow();
  const [type] = useDnD();

  //Background
  const [varient, setVarient] = useState('lines');

  //edit hook
  const [editValue, setEditValue] = useState(nodes.data);
  const [id, setID] = useState();
  const [selectedNode, setSelectedNode] = useState(null);
  //const [selectedEdge, setSelectedEdge] = useState(null); // Theo dõi edge được chọn
  
  //function for edit
  const onNodeClick = (e, val) => {
    setSelectedNode(val);  // Lưu node được chọn
    setEditValue(val.data.label);
    setID(val.id);
  }

  //handle change function
  const handleChange = (e) => {
    e.preventDefault();
    setEditValue(e.target.value);
  }

  const handleEdit = () => {
    const res = nodes.map((item) => {
      if (item.id === id) {
        // Tạo một bản sao của item và chỉ cập nhật label trong data
        return {
          ...item,  // sao chép toàn bộ item
          data: {
            ...item.data,  // sao chép dữ liệu của item
            label: editValue  // thay đổi label
          }
        };
      }
      return item;
    })
    setNodes(res);
    setEditValue('');
  }

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      // check if the dropped element is valid
      if (!type) {
        return;
      }

      // project was renamed to screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Tùy chỉnh các thuộc tính dựa trên nodeType
      // let sourcePosition = 'right';
      // let targetPosition = 'left';

      if (type === 'output') {
        const newNode = {
          id: getId(),
          type,
          position,
          data: { label: `${type} node` },
          targetPosition: 'left',
        };
        setNodes((nds) => nds.concat(newNode));
      }
      else {
        const newNode = {
          id: getId(),
          type,
          position,
          data: { label: `${type} node` },
          sourcePosition: 'right',        // Thiết lập vị trí dựa vào điều kiện
          targetPosition: 'left',
        };
        setNodes((nds) => nds.concat(newNode));
      }
    },
    [screenToFlowPosition, type],
  );

  // Lắng nghe sự kiện bàn phím
  useEffect(() => {    
    const handleKeyDown = (event) => {
      if (event.key === 'Delete' && selectedNode) {
        handleDeleteNode();  // Xóa node khi nhấn phím Delete
      }
    };

    // Thêm sự kiện lắng nghe
    document.addEventListener('keydown', handleKeyDown);

    // Xóa sự kiện khi component unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedNode]);

  // Hàm xử lý xóa node khi nhấn Delete
  const handleDeleteNode = () => {
    if (selectedNode) {
      // Lọc và loại bỏ node đã chọn
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));

      // Lọc và loại bỏ các edges liên quan đến node đã chọn
      setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));

      setSelectedNode(null);  // Sau khi xóa, reset lại selectedNode
    }
  };

  const currentDate = new Date();
  // Hàm lưu flow vào file
  const saveFlowToFile = () => {
    const flowData = { nodes, edges }; // Tạo dữ liệu flow
    const blob = new Blob([JSON.stringify(flowData, null, 2)], { type: 'application/json' }); // Tạo blob từ JSON
    const url = URL.createObjectURL(blob); // Tạo URL cho file
    const link = document.createElement('a'); // Tạo một thẻ <a> ẩn
    link.href = url; // Đặt URL
    link.download = 'react-flow' + currentDate.getFullYear() + (currentDate.getMonth() + 1) + currentDate.getDate() + currentDate.getHours() + currentDate.getMinutes() + currentDate.getSeconds() + '.json'; // Đặt tên cho file tải về
    link.click(); // Tự động tải file xuống
    URL.revokeObjectURL(url); // Hủy URL sau khi tải xong
  };

  // Hàm để tải dữ liệu từ file
  const loadFlowFromFile = (event) => {
    const file = event.target.files[0]; // Lấy file được tải lên
    if (file) {
      const reader = new FileReader(); // Đọc file
      reader.onload = (e) => {
        const flowData = JSON.parse(e.target.result); // Phân tích dữ liệu JSON
        setNodes(flowData.nodes || []); // Cập nhật nodes
        setEdges(flowData.edges || []); // Cập nhật edges
      };
      reader.readAsText(file); // Đọc file dưới dạng văn bản
    }
  };

  const clearFlow = () => {
    setNodes([]); // Xóa tất cả nodes
    setEdges([]); // Xóa tất cả edges
  };

  const navigate = useNavigate();

  const goToAutoRunScript = () => {
    navigate('/autorunscript');  // Điều hướng đến trang AutoScript
  };

  return (
      <div className="dndflow">        
        <div className="updatenode_control" >
          <label>Tên Node</label><br />
          <input type='text' value={editValue} onChange={handleChange} /><br />
          <button className='btn' onClick={handleEdit} >Update</button>
        </div>
        <div className="App" style={{ width: "100%", height: "80vh" }}>
          <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodeClick={(e, val) => onNodeClick(e, val)}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onDrop={onDrop}
              onDragOver={onDragOver}
              fitView
            >
              <Background color='#99b3ec' variant={varient} />
              <Controls />
            </ReactFlow>

            <div className="CEDFlow" >
              <button className='btnCreate' onClick={saveFlowToFile} >Lưu</button>
              {/* <button className='btnEdit' onChange={loadFlowFromFile}>Load Flow</button> */}
              <input type="file" className='btnEdit' onChange={loadFlowFromFile} /> {/* Input tải file */}
              <button className='btnDelete' onClick={clearFlow}>Xóa</button>
            </div>
            
            {/*Start Auto Run Script mở trang thì dùng route bên app.js */} 
            {/* <Link to="/autorunscript">AutoRunScript</Link>  */}
            <button onClick={goToAutoRunScript}>Đi đến AutoScript</button> 
            {/*End Auto Run Script */}
          </div>
        </div>
        <Sidebar />  
      </div> 
  );
};

export default () => (
  <ReactFlowProvider>
    <DnDProvider>
      <DnDFlow />
    </DnDProvider>
  </ReactFlowProvider>
);
