import React from 'react';
import { useDnD } from './DnDContext';
 
export default () => {
  const [_, setType] = useDnD();
 
  const onDragStart = (event, nodeType) => {
    debugger;
    setType(nodeType);
    event.dataTransfer.effectAllowed = 'move';    
  };

  // // Hàm lưu flow vào file JSON
  // const saveFlowToFile = () => {
  //   const flowData = { nodes, edges }; // Dữ liệu flow cần lưu
  //   const blob = new Blob([JSON.stringify(flowData, null, 2)], { type: 'application/json' });
  //   const url = URL.createObjectURL(blob); // Tạo URL cho file blob
  //   const link = document.createElement('a'); // Tạo liên kết tải file
  //   link.href = url;
  //   link.download = 'react-flow.json'; // Tên file tải xuống
  //   link.click(); // Kích hoạt tải file
  //   URL.revokeObjectURL(url); // Giải phóng URL khi không cần thiết nữa
  // };

  return (
    <aside>
      <div className="description">You can drag these nodes to the pane on the right.</div>
      <div className="dndnode block" onDragStart={(event) => onDragStart(event, 'block')} draggable>
        Block Node
      </div>
      <div className="dndnode http" onDragStart={(event) => onDragStart(event, 'http')} draggable>
        HTTP Node
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'key press')} draggable>
        Key Press Node
      </div>
      <div className="dndnode click" onDragStart={(event) => onDragStart(event, 'click')} draggable>
        Click Node
      </div>   
        
    </aside>
  );
};

