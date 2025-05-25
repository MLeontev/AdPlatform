import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

interface PageSizeProps {
  pageSize: number;
}

const pageSizes = [5, 10, 20, 50, 100];

export function PageSizeSelector({ pageSize }: PageSizeProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSizeChange = (size: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('pageSize', size.toString());
    setSearchParams(params);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        Элементов на странице:
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            {pageSize}
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {pageSizes.map((size) => (
            <DropdownMenuItem key={size} onClick={() => handleSizeChange(size)}>
              {size}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
