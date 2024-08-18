import { typeboxResolver } from '@hookform/resolvers/typebox';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { CopyToClipboardInput } from '@/components/custom/copy-to-clipboard';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { INTERNAL_ERROR_TOAST, useToast } from '@/components/ui/use-toast';
import { apiKeyApi } from '@/features/platform-admin-panel/lib/api-key-api';
import {
  ApiKeyResponseWithValue,
  CreateApiKeyRequest,
} from '@activepieces/ee-shared';

type NewApiKeyDialogProps = {
  children: React.ReactNode;
  onCreate: () => void;
};

export const NewApiKeyDialog = ({
  children,
  onCreate,
}: NewApiKeyDialogProps) => {
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState<ApiKeyResponseWithValue | undefined>(
    undefined,
  );
  const form = useForm<CreateApiKeyRequest>({
    resolver: typeboxResolver(CreateApiKeyRequest),
  });

  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: () => apiKeyApi.create(form.getValues()),
    onSuccess: (apiKey) => {
      setApiKey(apiKey);
      onCreate();
    },
    onError: () => {
      toast(INTERNAL_ERROR_TOAST);
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {apiKey ? 'API Key Created' : 'Create New API Key'}
          </DialogTitle>
        </DialogHeader>
        {apiKey && (
          <div className="p-4">
            <div className="flex flex-col items-start gap-2">
              <span className="text-md">
                Please save this secret key somewhere safe and accessible. For
                security reasons,{' '}
                <span className="font-semibold">
                  you won&apos;t be able to view it again after closing this
                  dialog.
                </span>
              </span>
              <CopyToClipboardInput textToCopy={apiKey.value} />
            </div>
          </div>
        )}
        {!apiKey && (
          <Form {...form}>
            <form
              className="grid space-y-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <FormField
                name="displayName"
                render={({ field }) => (
                  <FormItem className="grid space-y-4">
                    <Label htmlFor="displayName">API Key Name</Label>
                    <Input
                      {...field}
                      required
                      id="displayName"
                      placeholder="API Key Name"
                      className="rounded-sm"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form?.formState?.errors?.root?.serverError && (
                <FormMessage>
                  {form.formState.errors.root.serverError.message}
                </FormMessage>
              )}
            </form>
          </Form>
        )}
        <DialogFooter>
          {!apiKey ? (
            <>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                disabled={isPending || !form.formState.isValid}
                loading={isPending}
                onClick={() => mutate()}
              >
                Save
              </Button>
            </>
          ) : (
            <Button
              variant={'secondary'}
              onClick={() => {
                setApiKey(undefined);
                setOpen(false);
              }}
            >
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};