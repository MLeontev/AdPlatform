import React, { useEffect, useState } from 'react';
import type { Ad } from '@/types/ad';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AdFormProps {
  initialData?: Ad;
  onSubmit: (data: Ad) => void;
  categories: string[];
  cities: string[];
}

export const AdForm: React.FC<AdFormProps> = ({
  initialData,
  onSubmit,
  categories,
  cities,
}) => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState<Ad>(
    initialData || {
      title: '',
      description: '',
      price: 0,
      category: '',
      city: '',
      user: 'currentUserId', // заменить на реального пользователя
      images: [],
      isSold: false,
    },
  );

  useEffect(() => {
    const objectUrls = imageFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(objectUrls);

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageFiles]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setImageFiles((prev) => [...prev, ...fileArray]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;

    const newValue =
      type === 'checkbox' && e.target instanceof HTMLInputElement
        ? e.target.checked
        : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    formData.images = imagePreviews;
    if (initialData) {
      formData.updatedAt = new Date().toString();
    } else {
      formData.createdAt = new Date().toString();
      formData.updatedAt = new Date().toString();
    }
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="ad-form flex flex-col justify-between items-start w-fit h-fit bg-white p-6 rounded-lg shadow-md mb-8 mt-4 "
    >
      <Label className="ml-[10px] text-3xl font-bold text-center mb-8 mt-4">
        {initialData ? 'Редактирование объявления' : 'Создание объявления'}
      </Label>
      <Label className="ml-[10px]">Название</Label>
      <Input
        className="m-[10px] w-[300px]"
        name="title"
        minLength={3}
        maxLength={100}
        value={formData.title}
        onChange={handleChange}
        placeholder="Название"
        required
      />
      <Label className="ml-[10px]">Описание</Label>
      <Textarea
        className="m-[10px] w-[500px] min-h-[150px]"
        className="m-[10px] w-[413px] min-h-[150px]"
        name="description"
        minLength={10}
        maxLength={100}
        value={formData.description}
        onChange={handleChange}
        placeholder="Описание"
        required
      />
      <Label className="ml-[10px]">Стоимость</Label>
      <Input
        className="m-[10px] w-[300px]"
        type="number"
        name="price"
        min={0}
        max={999999999}
        value={formData.price}
        onChange={handleChange}
        placeholder="Цена"
        required
      />

      <Label className="ml-[10px]">
        Категория:
        <Select
          name="category"
          value={formData.category}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, category: value }))
          }
          required
        >
          <SelectTrigger className="m-[10px]">
            <SelectValue placeholder="Выберите категорию" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Категории</SelectLabel>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Label>

      <Label className="ml-[10px]">
        Город:
        <Select
          name="city"
          value={formData.city}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, city: value }))
          }
          required
        >
          <SelectTrigger className="m-[10px]">
            <SelectValue placeholder="Выберите город" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Города</SelectLabel>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Label>

      <Label className="ml-[10px]">
        Продано:
        <Input
          className="m-[10px] w-4"
          type="checkbox"
          name="isSold"
          checked={formData.isSold}
          onChange={handleChange}
        />
      </Label>
      {initialData && (
        <Label className="ml-[10px]">
          Продано:
          <Input
            className="m-[10px] w-4"
            type="checkbox"
            name="isSold"
            checked={formData.isSold}
            onChange={handleChange}
          />
        </Label>
      )}

      <div className="image-upload">
        <Label className="ml-[10px]">
          Изображения:
          <Input
            className="my-[10px] w-[300px]"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
          />
        </Label>
        <div className="preview-list flex gap-2.5 flex-wrap">
          {imagePreviews.map((url, index) => (
            <div key={index} className="relative">
              <img
                src={url}
                alt={`preview-${index}`}
                className="w-[100px] h-[100px] object-cover"
              />
              <Button
                type="button"
                onClick={() => removeImage(index)}
                className="m-[5px] absolute top-0 right-0"
              >
                X
              </Button>
            </div>
          ))}
        </div>
      </div>

      {initialData?.createdAt && (
        <Label className="m-[10px]">
          Создано: {new Date(initialData.createdAt).toLocaleString()}
        </Label>
      )}
      {initialData?.updatedAt && (
        <Label className="m-[10px]">
          Обновлено: {new Date(initialData.updatedAt).toLocaleString()}
        </Label>
      )}

      <Button className="m-[10px]" type="submit">
        {initialData ? 'Сохранить' : 'Создать'}
      </Button>
    </form>
  );
};
