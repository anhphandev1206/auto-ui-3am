import { Handle, Position } from '@xyflow/react';

function BlockNode({ data, isConnectable }) {
  return (
    <div className="react-flow__node-default">
      <div>
        <label htmlFor="text">{data.label}</label> 
        <p className="text-gray-500 italic text-[10px]">{data.description}</p> 
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="block"
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default BlockNode;
