import { useEffect, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useAppData } from './DataProvider';
import { Category } from '@/types/category.ts';

interface SingleCategorySelectorProps {
  selectedCategory?: number | null;
  onCategoryChange?: (selected: number | null) => void;
  className?: string;
}

export function SingleCategorySelector({
  selectedCategory: externalSelectedCategory = null,
  onCategoryChange,
  className,
}: SingleCategorySelectorProps) {
  const data = useAppData();
  const [internalSelectedCategory, setInternalSelectedCategory] = useState<
    number | null
  >(externalSelectedCategory);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setInternalSelectedCategory(externalSelectedCategory);
  }, [externalSelectedCategory]);

  if (!data) {
    return <div className={className}>Загрузка категорий...</div>;
  }

  const categories: Category[] =
    data.categories?.map((category) => ({
      id: category.id,
      name: category.name,
    })) || [];

  const filteredCategories = categories.filter(({ name }) =>
    name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelect = (id: number) => {
    const newSelected = id === internalSelectedCategory ? null : id;
    setInternalSelectedCategory(newSelected);
    onCategoryChange?.(newSelected);
  };

  const clearSelection = () => {
    setInternalSelectedCategory(null);
    onCategoryChange?.(null);
  };

  const getCategoryNameById = (id: number | null) => {
    if (id === null) return '';
    return categories.find((category) => category.id === id)?.name || '';
  };

  return (
    <div className={cn('space-y-4', className)}>
      <h2 className="text-lg font-semibold">Выбор категории</h2>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className="truncate">
              {internalSelectedCategory !== null
                ? getCategoryNameById(internalSelectedCategory)
                : 'Выберите категорию...'}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Поиск категории..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandEmpty>Категория не найдена</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-72">
                <CommandList>
                  {filteredCategories.map(({ id, name }) => (
                    <CommandItem
                      key={id}
                      value={id.toString()}
                      onSelect={() => handleSelect(id)}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          internalSelectedCategory === id
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                      {name}
                    </CommandItem>
                  ))}
                </CommandList>
              </ScrollArea>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Выбранная категория:</h3>
          {internalSelectedCategory !== null && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-muted-foreground"
              onClick={clearSelection}
            >
              Очистить
            </Button>
          )}
        </div>
        {internalSelectedCategory !== null ? (
          <div className="p-3 border rounded-md bg-muted/50">
            {getCategoryNameById(internalSelectedCategory)}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Категория не выбрана</p>
        )}
      </div>
    </div>
  );
}
