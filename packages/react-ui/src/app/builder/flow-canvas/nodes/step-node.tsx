import { TooltipTrigger } from '@radix-ui/react-tooltip';
import { Handle, Position } from '@xyflow/react';
import { CopyPlus, Replace, Trash } from 'lucide-react';
import React, { useState } from 'react';

import { useBuilderStateContext } from '@/app/builder/builder-hooks';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent } from '@/components/ui/tooltip';
import { UNSAVED_CHANGES_TOAST, useToast } from '@/components/ui/use-toast';
import { piecesHooks } from '@/features/pieces/lib/pieces-hook';
import { cn } from '@/lib/utils';
import { FlowOperationType, flowHelper } from '@activepieces/shared';

import { ApNode } from '../flow-canvas-utils';

const ApStepNode = React.memo(({ data }: { data: ApNode['data'] }) => {
  const { toast } = useToast();
  const selectStep = useBuilderStateContext((state) => state.selectStep);
  const isSelected = useBuilderStateContext(
    (state) => state.selectedStep?.stepName === data.step?.name,
  );
  const deleteStep = useBuilderStateContext((state) => () => {
    state.applyOperation(
      {
        type: FlowOperationType.DELETE_ACTION,
        request: {
          name: data.step!.name,
        },
      },
      () => toast(UNSAVED_CHANGES_TOAST),
    );
  });

  const duplicateStep = useBuilderStateContext((state) => () => {
    state.applyOperation(
      {
        type: FlowOperationType.DUPLICATE_ACTION,
        request: {
          stepName: data.step!.name,
        },
      },
      () => toast(UNSAVED_CHANGES_TOAST),
    );
  });

  const pieceMetadata = piecesHooks.usePieceMetadata({
    step: data.step!,
  }).data;

  const [toolbarOpen, setToolbarOpen] = useState(false);

  const handleClick = () => {
    console.log('select step from builder');
    selectStep({ path: [], stepName: data.step!.name });
  };

  return (
    <div
      className={cn(
        'h-[70px] w-[260px] rounded bg-background border border-solid box-border ',
        {
          'border-primary': toolbarOpen || isSelected,
        },
      )}
      onClick={() => handleClick()}
      onMouseEnter={() => setToolbarOpen(true)}
      onMouseLeave={() => setToolbarOpen(false)}
    >
      <div
        className={cn('w-full absolute h-[3px] bg-primary opacity-0', {
          'opacity-100': toolbarOpen || isSelected,
          'opacity-0': !toolbarOpen && !isSelected,
        })}
      ></div>
      <div className="px-2 h-full">
        <div className="flex h-full items-center justify-between gap-4">
          <div className="items-center justify-center">
            <img src={pieceMetadata?.logoUrl} width="46" height="46" />
          </div>
          <div className="grow">
            <div className="text-sm">{data.step!.displayName}</div>
            <div className="text-xs text-muted-foreground">
              {pieceMetadata?.displayName}
            </div>
          </div>
        </div>

        <div
          className={cn(
            'w-[40px] h-[70px] absolute left-[-40px] top-[0px] transition-opacity duration-300',
            {
              'opacity-0': !toolbarOpen,
              'opacity-100': toolbarOpen,
            },
          )}
        >
          <div className="flex flex-col gap-2 items-center justify-center mr-4 h-full">
            {flowHelper.isTrigger(data.step!.type) && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Replace className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Replace Trigger</TooltipContent>
              </Tooltip>
            )}
            {flowHelper.isAction(data.step!.type) && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                      onClick={(e) => {
                        deleteStep();
                        e.stopPropagation();
                      }}
                    >
                      <Trash className="w-4 h-4 text-destructive" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">Delete step</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                      onClick={(e) => {
                        duplicateStep();
                        e.stopPropagation();
                      }}
                    >
                      <CopyPlus className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">Duplicate step</TooltipContent>
                </Tooltip>
              </>
            )}
          </div>
        </div>
      </div>

      <Handle type="source" style={{ opacity: 0 }} position={Position.Bottom} />
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
    </div>
  );
});

ApStepNode.displayName = 'ApStepNode';
export { ApStepNode };