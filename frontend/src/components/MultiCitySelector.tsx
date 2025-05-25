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
import { useAppData } from '@/components/DataProvider.tsx';
import { City } from '@/types/city.ts';

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
  const data = useAppData();
  const [internalSelectedCities, setInternalSelectedCities] = useState<
    number[]
  >(externalSelectedCities);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setInternalSelectedCities(externalSelectedCities);
  }, [externalSelectedCities]);

  if (!data) {
    return <div>Загрузка данных...</div>;
  }

  const cities: City[] =
    data.cities?.map((city) => ({
      id: city.id,
      name: city.name,
    })) || [];

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelect = (id: number) => {
    const newSelected = internalSelectedCities.includes(id)
      ? internalSelectedCities.filter((i) => i !== id)
      : [...internalSelectedCities, id];

    setInternalSelectedCities(newSelected);
    onCitiesChange?.(newSelected);
  };

  const removeCity = (id: number) => {
    const newSelected = internalSelectedCities.filter((i) => i !== id);
    setInternalSelectedCities(newSelected);
    onCitiesChange?.(newSelected);
  };

  const getCityNameById = (id: number) => {
    return cities.find((city) => city.id === id)?.name || '';
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
                  {filteredCities.map((city) => (
                    <CommandItem
                      key={city.id}
                      value={city.id.toString()}
                      onSelect={() => handleSelect(city.id)}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          internalSelectedCities.includes(city.id)
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                      {city.name}
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
              internalSelectedCities.map((id) => (
                <div
                  key={id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <span>{getCityNameById(id)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-muted-foreground"
                    onClick={() => removeCity(id)}
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
