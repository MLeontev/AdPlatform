import { Check, ChevronsUpDown, X } from 'lucide-react';
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
import { useEffect, useState } from 'react';

const cities = [
  'Москва',
  'Санкт-Петербург',
  'Новосибирск',
  'Екатеринбург',
  'Казань',
  'Нижний Новгород',
  'Челябинск',
  'Самара',
  'Омск',
  'Ростов-на-Дону',
  'Уфа',
  'Красноярск',
  'Пермь',
  'Воронеж',
  'Волгоград',
];

interface MultiCitySelectorProps {
  selectedCities?: number[];
  onCitiesChange?: (selected: number[]) => void;
  className?: string;
}

export function MultiCitySelector({
  selectedCities: externalSelectedCities = [],
  onCitiesChange,
  className,
}: MultiCitySelectorProps) {
  const [internalSelectedCities, setInternalSelectedCities] = useState<
    number[]
  >(externalSelectedCities);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setInternalSelectedCities(externalSelectedCities);
  }, [externalSelectedCities]);

  const filteredCities = cities
    .map((city, index) => ({ index, city }))
    .filter(({ city }) =>
      city.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const handleSelect = (index: number) => {
    const newSelected = internalSelectedCities.includes(index)
      ? internalSelectedCities.filter((i) => i !== index)
      : [...internalSelectedCities, index];

    setInternalSelectedCities(newSelected);
    onCitiesChange?.(newSelected);
  };

  const removeCity = (index: number) => {
    const newSelected = internalSelectedCities.filter((i) => i !== index);
    setInternalSelectedCities(newSelected);
    onCitiesChange?.(newSelected);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <h2 className="text-lg font-semibold">Выбор городов</h2>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className="truncate">
              {internalSelectedCities.length > 0
                ? `Выбрано: ${internalSelectedCities.length}`
                : 'Выберите города...'}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Поиск города..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandEmpty>Город не найден</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-72">
                <CommandList>
                  {filteredCities.map(({ index, city }) => (
                    <CommandItem
                      key={index}
                      value={index.toString()}
                      onSelect={() => handleSelect(index)}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          internalSelectedCities.includes(index)
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                      {city}
                    </CommandItem>
                  ))}
                </CommandList>
              </ScrollArea>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Выбранные города:</h3>
        <ScrollArea className="h-72">
          <div className="space-y-2">
            {internalSelectedCities.length > 0 ? (
              internalSelectedCities.map((index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <span>{cities[index]}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-muted-foreground"
                    onClick={() => removeCity(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Нет выбранных городов
              </p>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
