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
          className="w-[150px] h-[130px] my-3 object-cover rounded-lg"
        />
        <div className="flex flex-col ml-[10px] text-left justify-center">
          <CardTitle className="text-xl">{props.ad.title}</CardTitle>
          <CardTitle className="text-xl">{props.ad.price} ₽</CardTitle>
          <CardDescription>Категория: {props.ad.categoryName}</CardDescription>
          <CardDescription>Город: {props.ad.cityName}</CardDescription>
        </div>
        <div className="flex justify-end items-center w-full" />
      </CardContent>
    </Card>
  );
};
