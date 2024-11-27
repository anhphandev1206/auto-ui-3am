import React from 'react';
import { useDnD } from './DnDContext';
 
export default () => {
  const [_, setType] = useDnD();
 
  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = 'move';    
  };

  return (
    <aside>
      <div className="description">You can drag these nodes to the pane on the right.</div>
      <div className="dndnode block" onDragStart={(event) => onDragStart(event, 'block')} draggable>
        Block Node
      </div>
      <div className="dndnode http" onDragStart={(event) => onDragStart(event, 'http')} draggable>
        HTTP Node
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'keyPress')} draggable>
        Key Press Node
      </div>
      <div className="dndnode click" onDragStart={(event) => onDragStart(event, 'click')} draggable>
        Click Node
      </div>   
        
    </aside>
  );
};

