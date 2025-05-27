'use client';

import { Check, ChevronDown } from 'lucide-react';
import { startTransition, useMemo, useOptimistic, useState } from 'react';

import { saveModel } from '@/app/(chat)/actions';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Model, getAvailableModels } from '@/lib/model';
import { cn } from '@/lib/utils';

export function ModelSelector({
  selectedModelName,
  userMembership = 'free',
  className,
}: {
  selectedModelName: Model['name'];
  userMembership?: string;
} & React.ComponentProps<typeof Button>) {
  const [open, setOpen] = useState(false);
  const [optimisticModelName, setOptimisticModelName] =
    useOptimistic(selectedModelName);

  const availableModels = useMemo(
    () => getAvailableModels(userMembership),
    [userMembership]
  );

  const selectModel = useMemo(
    () => availableModels.find((model) => model.name === optimisticModelName),
    [optimisticModelName, availableModels]
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        asChild
        className={cn(
          'w-fit data-[state=open]:bg-accent data-[state=open]:text-accent-foreground md:h-8 [&>svg]:!size-5 md:[&>svg]:!size-4',
          className
        )}
      >
        <Button variant="ghost">
          {selectModel?.label}
          <ChevronDown className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[300px]">
        {availableModels.map((model) => (
          <DropdownMenuItem
            key={model.name}
            onSelect={() => {
              setOpen(false);

              startTransition(() => {
                setOptimisticModelName(model.name);
                saveModel(model.name);
              });
            }}
            className="gap-4 group/item"
            data-active={model.name === optimisticModelName}
          >
            <div className="flex flex-col gap-1 items-start">
              {model.label}
              {model.description && (
                <div className="text-xs text-muted-foreground">
                  {model.description}
                </div>
              )}
            </div>
            <Check className="size-4 ml-auto opacity-0 group-data-[active=true]/item:opacity-100" />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
