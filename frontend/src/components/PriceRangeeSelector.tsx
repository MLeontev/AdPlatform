import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface PriceRangeSelectorProps {
  minPrice?: number;
  maxPrice?: number;
  value?: { min: number | null; max: number | null };
  onValueChange?: (values: { min: number | null; max: number | null }) => void;
  className?: string;
}

export function PriceRangeSelector({
  minPrice = 0,
  maxPrice = 10000,
  value = { min: null, max: null },
  onValueChange,
  className,
}: PriceRangeSelectorProps) {
  const [internalValues, setInternalValues] = useState<[number, number]>([
    minPrice,
    maxPrice,
  ]);
  const [activeValues, setActiveValues] = useState<{
    min: number | null;
    max: number | null;
  }>(value);

  useEffect(() => {
    setActiveValues(value);
    if (value.min !== null && value.max !== null) {
      setInternalValues([value.min, value.max]);
    }
  }, [value]);

  const handleSliderChange = (newValues: number[]) => {
    setInternalValues([newValues[0], newValues[1]]);
    setActiveValues({ min: newValues[0], max: newValues[1] });
    onValueChange?.({ min: newValues[0], max: newValues[1] });
  };

  const handleInputChange = (type: 'min' | 'max', inputValue: string) => {
    const numValue = inputValue === '' ? null : parseInt(inputValue) || 0;
    const newValues = { ...activeValues, [type]: numValue };

    // Если оба значения заданы, обновляем слайдер
    if (newValues.min !== null && newValues.max !== null) {
      setInternalValues([newValues.min, newValues.max]);
    }

    setActiveValues(newValues);
    onValueChange?.(newValues);
  };

  const clearValues = () => {
    setActiveValues({ min: null, max: null });
    onValueChange?.({ min: null, max: null });
  };

  const hasValues = activeValues.min !== null || activeValues.max !== null;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex justify-between items-center">
        <Label>Диапазон цен</Label>
        {hasValues && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-muted-foreground"
            onClick={clearValues}
          >
            <X className="mr-1 h-4 w-4" />
            Сбросить
          </Button>
        )}
      </div>

      {activeValues.min !== null && activeValues.max !== null && (
        <Slider
          min={minPrice}
          max={maxPrice}
          value={internalValues}
          onValueChange={handleSliderChange}
          step={100}
          minStepsBetweenThumbs={1}
          className="w-full"
        />
      )}

      <div className="flex gap-4 flex-col">
        <div className="space-y-2 flex-1">
          <Label htmlFor="min-price">От</Label>
          <Input
            id="min-price"
            type="number"
            value={activeValues.min?.toString() ?? ''}
            onChange={(e) => handleInputChange('min', e.target.value)}
            placeholder="Не указано"
            min={minPrice}
            max={activeValues.max ?? maxPrice}
          />
        </div>
        <div className="space-y-2 flex-1">
          <Label htmlFor="max-price">До</Label>
          <Input
            id="max-price"
            type="number"
            value={activeValues.max?.toString() ?? ''}
            onChange={(e) => handleInputChange('max', e.target.value)}
            placeholder="Не указано"
            min={activeValues.min ?? minPrice}
            max={maxPrice}
          />
        </div>
      </div>
    </div>
  );
}
