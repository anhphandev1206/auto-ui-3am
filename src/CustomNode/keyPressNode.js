import { Handle, Position } from '@xyflow/react';

function KeyPressNode({ data, isConnectable }) {
  return (
    <div className="react-flow__node-default">
      <Handle
        type="target"
        position={Position.Left}
        id="keyPress"
        isConnectable={isConnectable}
      />
      <div>
        <label htmlFor="text">{data.label}</label>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="top-[25%] bg-green-400"
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="top-[75%] bg-red-400"
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default KeyPressNode;
