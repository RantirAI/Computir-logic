import { useMutation } from '@tanstack/react-query';
import { ViewportPortal } from '@xyflow/react';
import React from 'react';

import { useSocket } from '@/components/socket-provider';
import { Button } from '@/components/ui/button';
import { INTERNAL_ERROR_TOAST, toast } from '@/components/ui/use-toast';
import { flowsApi } from '@/features/flows/lib/flows-api';

import { useBuilderStateContext } from '../builder-hooks';

const TestFlowWidget = React.memo(() => {
  const [flowVersion, setRun] = useBuilderStateContext((state) => [
    state.flowVersion,
    state.setRun,
  ]);
  const socket = useSocket();
  const { mutate, isPending } = useMutation<void>({
    mutationFn: () =>
      flowsApi.testFlow(
        socket,
        {
          flowVersionId: flowVersion.id,
        },
        (run) => {
          setRun(run, flowVersion);
        },
      ),
    onSuccess: () => {},
    onError: (error) => {
      console.log(error);
      toast(INTERNAL_ERROR_TOAST);
    },
  });
  return (
    <ViewportPortal>
      <div
        style={{
          transform: 'translate(0px, -50px)',
          position: 'absolute',
          pointerEvents: 'auto',
        }}
      >
        <div className="justify-center items-center flex w-[260px]">
          {flowVersion.valid && (
            <Button
              variant="outline"
              className="h-8"
              loading={isPending}
              onClick={() => mutate()}
            >
              {' '}
              Test Flow{' '}
            </Button>
          )}
          {!flowVersion.valid && (
            <Button variant="outline" className="h-8">
              {' '}
              Complete Settings{' '}
            </Button>
          )}
        </div>
      </div>
    </ViewportPortal>
  );
});

TestFlowWidget.displayName = 'TestFlowWidget';
export { TestFlowWidget };
