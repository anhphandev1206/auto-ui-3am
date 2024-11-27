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
import {
  BlockNode,
  HTTPNode,
  KeyPressNode
} from "../CustomNode/index"

import Sidebar from './Sidebar';
import { DnDProvider, useDnD } from './DnDContext';
import '@xyflow/react/dist/style.css';
import './index.css';
import { useNavigate } from 'react-router-dom';
import { ACTION_TYPE, BLOCK, LOGIC, TYPE_KEY_PRESS } from '../common/constant.helper';
const initialNodes = [
  {
    id: LOGIC.BEFORE,
    type: 'block',
    data: { block: 1, nodes: [], expanded: true, id: LOGIC.BEFORE, label: 'Block node', description: '//Before browser opened' },
    position: { x: 250, y: 0 },
    sourcePosition: 'right',
  },
  {
    id: LOGIC.MAIN,
    type: 'block',
    data: { block: 1, nodes: [], expanded: true, id: LOGIC.MAIN, label: 'Block node', description: '//Main logic' },
    position: { x: 250, y: 100 },
    sourcePosition: 'right',
  },
  {
    id: LOGIC.AFTER,
    type: 'block',
    data: { block: 1, nodes: [], expanded: true, id: LOGIC.AFTER, label: 'Block node', description: '//After browser closed' },
    position: { x: 250, y: 200 },
    sourcePosition: 'right',
  },
];

const nodeTypes = { block: BlockNode, http: HTTPNode, keyPress: KeyPressNode };

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {

  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const [type] = useDnD();

  const [varient, setVarient] = useState('lines');

  // Properties
  const [nameNode, setNameNode] = useState('');
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [id, setID] = useState();
  const [selectedNode, setSelectedNode] = useState(null);
  //const [selectedEdge, setSelectedEdge] = useState(null); // Theo dõi edge được chọn
  //function for edit
  const onNodeClick = (e, val) => {
    setSelectedNode(val);  // Lưu node được chọn
    setNameNode(val.data.label);
    if (val.type == 'http') {
      setUrl(val.data.url);
      setKey('');
    } else if (val.type == 'keyPress') {
      setKey(val.data.key);
      setUrl('');
    }
    setID(val.id);
  }

  const handleChangeName = (e) => {
    e.preventDefault();
    setNameNode(e.target.value);
  }

  const handleChangeUrl = (e) => {
    e.preventDefault();
    setUrl(e.target.value);
  }

  const handleChangeKey = (e) => {
    e.preventDefault();
    setKey(e.target.value);
  }

  const handleEdit = () => {
    const res = nodes.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          data: {
            ...item.data,
            label: nameNode,
            url: url,
            key: key,
          }
        };
      }
      return item;
    })
    setNodes(res);
    setNameNode('');
    setUrl('');
    setKey('');
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

      if (!type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      let newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node`, },
        sourcePosition: 'right',
        targetPosition: 'left',
      };
      if (type == 'http') {
        newNode = {
          id: getId(),
          type,
          position,
          data: { action_type: ACTION_TYPE.HTTP_REQUEST, label: `${type} node`, url, method: 'GET', headers: {}, data: {}, expanded: true, description: 'HTTP Request' },
          sourcePosition: 'right',
          targetPosition: 'left',
        };
      } else if (type == 'keyPress') {
        newNode = {
          id: getId(),
          type,
          position,
          data: { action_type: ACTION_TYPE.KEY_PRESS, label: `${type} node`, key: 'Hello World', expanded: true, description: 'Key Press', type: TYPE_KEY_PRESS.SINGLE, xpath: '/html/body/div[1]/div[3]/form/div[1]/div[1]/div[1]/div/div[2]/textarea', delay: 0, delay_completion: 0 },
          sourcePosition: 'right',
          targetPosition: 'left',
        };
      }

      setNodes((nds) => nds.concat(newNode));
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
    const flowData = { nodes, edges };
    const result = {
      $type: "AUTO",
      before_init: {
        block: BLOCK.NORMAL,
        nodes: [],
        expanded: true,
        id: LOGIC.BEFORE,
        description: "Before browser opened"
      },
      main_logic: {
        block: BLOCK.NORMAL,
        nodes: [],
        expanded: true,
        id: LOGIC.MAIN,
        description: "Main Logic"
      },
      after_quit: {
        block: BLOCK.NORMAL,
        nodes: [],
        expanded: true,
        id: LOGIC.AFTER,
        description: "After browser closed"
      }
    }
    const sources = edges.map(edge => edge.source);
    let sourceMainLogic = LOGIC.MAIN;
    const mainLogic = [];
    while (sources.includes(sourceMainLogic)) {
      const edge = edges.find(edge => edge.source == sourceMainLogic);
      const node = nodes.find(node => node.id == edge.target);
      sourceMainLogic = edge.target;
      let newNode = {
        id: node.id,
        nodes: [],
        expanded: true,
        description: node.description,
      }
      if (node.type == 'http') {
        newNode = {
          id: node.id,
          action_type: node.data.action_type,
          url: node.data.url,
          method: node.data.method,
          headers: node.data.headers,
          data: node.data.data,
          expanded: true,
          description: node.description,
        }
      } else if (node.type == 'keyPress') {
        newNode = {
          id: node.id,
          action_type: node.data.action_type,
          key: node.data.key,
          expanded: true,
          type: node.data.type,
          xpath: node.data.xpath,
          delay: node.data.delay,
          delay_completion: node.data.delay_completion,
          description: node.description,
        }
      }
      mainLogic.push(newNode);
    }
    console.log(mainLogic);
    result.main_logic.nodes = mainLogic;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' }); // Tạo blob từ JSON
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
      <div className="w-[20%] flex items-center flex-col p-4 gap-4">
        <div>
          <label>Tên Node</label><br />
          <input type='text' className="border-2 border-solid" value={nameNode} onChange={handleChangeName} /><br />
        </div>
        <div>
          <label>URL</label><br />
          <input type='text' className="border-2 border-solid" value={url} onChange={handleChangeUrl} /><br />
        </div>
        <div>
          <label>Key</label><br />
          <input type='text' className="border-2 border-solid" value={key} onChange={handleChangeKey} /><br />
        </div>
        <button className='border-2 border-solid' onClick={handleEdit} >Update</button>
      </div>
      <div className="App" style={{ width: "100%", height: "80vh" }}>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
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
