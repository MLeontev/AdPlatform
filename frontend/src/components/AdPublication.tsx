import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { MapPin, User, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ImageGallery from '@/components/ImageGalary.tsx';
import { ImageDto } from '@/types/DTOs/imageDto.ts';
import { AdDto } from '@/types/DTOs/adDto.ts';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Input } from '@/components/ui/input.tsx';

interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface AdPageProps {
  data: AdDto;
}

export function AdPublication({ data }: AdPageProps) {
  const formattedDate = format(new Date(data.createdAt), 'PPP', {
    locale: ru,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-0">
              <ImageGallery
                images={data.images.map((image: ImageDto) => {
                  return image.url;
                })}
              />
            </CardContent>
          </Card>

          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold">{data.title}</h1>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">
                {data.price.toLocaleString()} ₽
              </span>
              {data.isSold && (
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  Продано
                </span>
              )}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Описание</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-start">
                {data.description}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Продавец</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  {data.user.avatarSrc ? (
                    <img
                      src={data.user.avatarSrc}
                      alt={data.user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="text-gray-400" size={24} />
                  )}
                </div>
                <div>
                  <p className="font-medium">{data.user.name}</p>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full mt-4" variant="outline">
                    Связаться с продавцом
                  </Button>
                </DialogTrigger>
                <DialogContent className="px-4 py-4">
                  <DialogTitle>Связь с продавцом</DialogTitle>
                  <DialogDescription>
                    Можете связаться с продавцом удобным для вас способом
                  </DialogDescription>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Номер телефона:</Label>
                      <Input
                        value={data.user.phone}
                        className="col-span-3"
                        readOnly
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Электронная почта:</Label>
                      <Input
                        value={data.user.email}
                        className="col-span-3"
                        readOnly
                      />
                    </div>
                  </div>
                  <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Закрыть
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Детали объявления</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="text-gray-500" size={20} />
                <div>
                  <p className="text-sm text-gray-500 text-start">Город</p>
                  <p className="font-medium">{data.cityName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Tag className="text-gray-500" size={20} />
                <div>
                  <p className="text-sm text-gray-500 text-start">Категория</p>
                  <p className="font-medium">{data.categoryName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="text-gray-500" size={20} />
                <div>
                  <p className="text-sm text-gray-500 text-start">
                    Дата публикации
                  </p>
                  <p className="font-medium">{formattedDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Button variant="outline" className="w-full">
              Пожаловаться
            </Button>
            <Button variant="outline" className="w-full">
              Добавить в избранное
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
