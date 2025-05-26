import { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function CustomDialog({
  triggerChild,
  contentChild,
  title,
  description,
}: {
  triggerChild: ReactNode;
  contentChild: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{triggerChild}</DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="hidden">{title}</DialogTitle>
          <DialogDescription className="hidden">
            {description}
          </DialogDescription>
        </DialogHeader>
        {contentChild}
      </DialogContent>
    </Dialog>
  );
}
