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

const categories = [
  'Электроника',
  'Одежда',
  'Продукты питания',
  'Дом и сад',
  'Красота',
  'Спорт',
  'Авто товары',
  'Детские товары',
  'Книги',
  'Зоотовары',
];

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
  const [internalSelectedCategory, setInternalSelectedCategory] = useState<
    number | null
  >(externalSelectedCategory);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setInternalSelectedCategory(externalSelectedCategory);
  }, [externalSelectedCategory]);

  const filteredCategories = categories
    .map((category, index) => ({ index, category }))
    .filter(({ category }) =>
      category.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const handleSelect = (index: number) => {
    const newSelected = index === internalSelectedCategory ? null : index;
    setInternalSelectedCategory(newSelected);
    onCategoryChange?.(newSelected);
  };

  const clearSelection = () => {
    setInternalSelectedCategory(null);
    onCategoryChange?.(null);
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
                ? categories[internalSelectedCategory]
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
                  {filteredCategories.map(({ index, category }) => (
                    <CommandItem
                      key={index}
                      value={index.toString()}
                      onSelect={() => handleSelect(index)}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          internalSelectedCategory === index
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                      {category}
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
          <h3 className="text-sm font-medium ">Выбранная категория:</h3>
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
            {categories[internalSelectedCategory]}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Категория не выбрана</p>
        )}
      </div>
    </div>
  );
}
