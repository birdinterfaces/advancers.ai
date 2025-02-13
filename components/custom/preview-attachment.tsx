import { Attachment } from 'ai';
import { FileIcon, ImageIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { LoaderIcon } from './icons';

export const PreviewAttachment = ({
  attachment,
  isUploading = false,
  className,
}: {
  attachment: Attachment;
  isUploading?: boolean;
  className?: string;
}) => {
  const { name, url, contentType } = attachment;

  const handleClick = () => {
    if (!isUploading && url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <button
        onClick={handleClick}
        disabled={isUploading || !url}
        className={cn(
          "w-24 aspect-video bg-muted rounded-md relative flex flex-col items-center justify-center overflow-hidden",
          "hover:ring-2 hover:ring-offset-2 hover:ring-primary transition-all",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
        )}
      >
        {contentType ? (
          contentType.startsWith('image') ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={url}
              src={url}
              alt={name ?? 'An image attachment'}
              className="rounded-md size-full object-cover"
            />
          ) : contentType === 'application/pdf' ? (
            <div className="flex flex-col items-center justify-center gap-1">
              <FileIcon className="h-8 w-8 text-primary" />
              <span className="text-[10px] text-muted-foreground">PDF</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-1">
              <FileIcon className="h-8 w-8 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">File</span>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center gap-1">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">Loading</span>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <div className="animate-spin text-primary">
              <LoaderIcon />
            </div>
          </div>
        )}
      </button>
      <div className="text-xs text-muted-foreground max-w-24 truncate px-1">{name}</div>
    </div>
  );
};
