import { CollapsibleContent } from '@radix-ui/react-collapsible';
import { useState } from 'react';

import {
  Collapsible,
  CollapsibleTrigger,
} from '../../../components/ui/collapsible';

import { DataSelectorNodeContent } from './data-selector-node-content';
import { MentionTreeNode } from './data-selector-utils';
import { TestStepSection } from './test-step-section';

type DataSelectoNodeProps = {
  node: MentionTreeNode;
  depth: number;
};

const DataSelectorNode = ({ node, depth }: DataSelectoNodeProps) => {
  const [expanded, setExpanded] = useState(false);

  if (node.data.isTestStepNode) {
    return (
      <TestStepSection stepName={node.data.propertyPath}></TestStepSection>
    );
  }
  return (
    <Collapsible className="w-full" open={expanded} onOpenChange={setExpanded}>
      <>
        <CollapsibleTrigger asChild={true} className="w-full relative">
          <DataSelectorNodeContent
            node={node}
            expanded={expanded}
            setExpanded={setExpanded}
            depth={depth}
          ></DataSelectorNodeContent>
        </CollapsibleTrigger>
        <CollapsibleContent className="w-full">
          {node.children && node.children.length > 0 && (
            <div className="flex flex-col ">
              {node.children.map((node) => (
                <DataSelectorNode
                  depth={depth + 1}
                  node={node}
                  key={node.key}
                ></DataSelectorNode>
              ))}
            </div>
          )}
        </CollapsibleContent>
      </>
    </Collapsible>
  );
};
DataSelectorNode.displayName = 'DataSelectorNode';
export { DataSelectorNode };