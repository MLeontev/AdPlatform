import { AdListItemDto } from '@/types/DTOs/adListItemDto.ts';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card.tsx';
import defaultImage from '../assets/defaultImage.svg';

export const AdFeedElement = (props: {
  ad: AdListItemDto;
  onClick: (adId: number) => void;
}) => {
  const handleClick = () => {
    props.onClick(props.ad.id);
  };

  return (
    <Card onClick={handleClick} className="h-fit my-3 cursor-pointer">
      <CardContent className="flex flex-row flex-nowrap">
        <img
          src={props.ad.mainImage !== '' ? props.ad.mainImage : defaultImage}
          alt="Фото товара"
          className="w-[100px] h-[100px] my-3"
        />
        <div className="flex flex-col ml-[10px] text-left">
          <CardTitle className="text-xl">{props.ad.title}</CardTitle>
          <CardTitle className="text-xl">{props.ad.price} руб.</CardTitle>
          <CardDescription>Категория: {props.ad.categoryName}</CardDescription>
          <CardDescription>Город: {props.ad.cityName}</CardDescription>
        </div>
      </CardContent>
    </Card>
  );
};
