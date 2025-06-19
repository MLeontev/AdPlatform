import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label.tsx';
import { Card } from '@/components/ui/card.tsx';

interface SoldFilterProps {
  isSold: boolean | null;
  onSoldChange: (value: boolean | null) => void;
}

export const SoldFilter = ({ isSold, onSoldChange }: SoldFilterProps) => {
  const handleChange = (value: string) => {
    if (value === 'all') {
      onSoldChange(null);
    } else if (value === 'sold') {
      onSoldChange(true);
    } else {
      onSoldChange(false);
    }
  };

  return (
    <Card className="p-3 space-y-2">
      <Label className="font-medium">Статус объявления</Label>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="all-status"
          checked={isSold === null}
          onCheckedChange={() => handleChange('all')}
        />
        <Label
          htmlFor="all-status"
          className="text-sm font-medium leading-none"
        >
          Все
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="sold"
          checked={isSold === true}
          onCheckedChange={() => handleChange('sold')}
        />
        <Label htmlFor="sold" className="text-sm font-medium leading-none">
          Проданные
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="not-sold"
          checked={isSold === false}
          onCheckedChange={() => handleChange('not-sold')}
        />
        <Label htmlFor="not-sold" className="text-sm font-medium leading-none">
          Непроданные
        </Label>
      </div>
    </Card>
  );
};
