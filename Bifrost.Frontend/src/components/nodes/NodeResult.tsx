import { useEffect, useState } from "react";
import { Position } from "reactflow";
import MultiHandle from "../nodeLayout/MultiHandle";
import NodeBody from "../nodeLayout/NodeBody";

interface NodeResultData {
  result?: number;
}

interface NodeResultProps {
  data: NodeResultData;
}

function NodeResult({ data }: NodeResultProps) {
  const [result, setResult] = useState<number>(0);

  useEffect(() => {
    if (data && data.result !== undefined) {
      console.log(`NodeResult: setting result to ${data.result}`); // Debugging line
      setResult(data.result);
    }
  }, [data]);

  return (
    <div className="node-title">
      <p>Print</p>
      <div className="node-base">
        <MultiHandle type='target' position={Position.Left} ids={["text"]} />
        <NodeBody>
          <p>Result: {result} </p>
        </NodeBody>
      </div>
    </div>
  );
}

export default NodeResult;
