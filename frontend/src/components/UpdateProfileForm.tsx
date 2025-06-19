import React, { useState, FormEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

import { updateUser, getUser } from "@/api/user.ts";

import { UpdateProfileDto } from "@/types/DTOs/updateProfileDto.ts";
import { UserLinkDto } from "@/types/DTOs/userLinkDto.ts";
import { useAuthStore } from "@/store/authStore.ts";

export const UpdateProfileForm: React.FC = () => {
  const [formData, setFormData] = useState<Omit<UpdateProfileDto, 'avatar'>>({
    name: '',
    surname: '',
    email: '',
    phone: '',
    links: [],
  });
  const id = useAuthStore((state) => state.id);

  const [userId, setUserId] = useState<number | null>(null);

  const [avatarFile, setAvatarFile] = useState<File | undefined>();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const user = await getUser(id!);

        if (!user) {
          setError("Не удалось найти данные пользователя. Возможно, вы не авторизованы.");
          setIsLoading(false);
          return;
        }

        setFormData({
          name: user.name || '',
          surname: user.surname || '',
          email: user.email || '',
          phone: user.phone || '',
          links: user.links || [],
        });
        setAvatarPreview(user.avatarSrc);
        setUserId(user.id);

      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError("Не удалось загрузить данные профиля. Попробуйте обновить страницу.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleLinkChange = (index: number, field: keyof UserLinkDto, value: string) => {
    const newLinks = [...formData.links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFormData((prev) => ({ ...prev, links: newLinks }));
  };

  const addLink = () => {
    setFormData((prev) => ({ ...prev, links: [...prev.links, { platform: '', link: '' }] }));
  };

  const removeLink = (index: number) => {
    setFormData((prev) => ({ ...prev, links: prev.links.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userId) {
      console.error("User ID is not set, cannot update.");
      return;
    }

    setIsSubmitting(true);
    const dataToSend: UpdateProfileDto = { ...formData, avatar: avatarFile };

    try {
      await updateUser(userId, dataToSend);
    } catch (error) {
      console.error("Submit failed in form component", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto my-8">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="grid gap-2 flex-1">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-32" />
        </CardFooter>
      </Card>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-8">{error}</div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto my-8">
      <CardHeader>
        <CardTitle>Редактирование профиля</CardTitle>
        <CardDescription>
          Обновите информацию вашего профиля. Нажмите "Сохранить", когда закончите.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-6">
          {/* Аватар */}
          <div className="flex items-center gap-4">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Предпросмотр аватара"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                Предпросмотр
              </div>
            )}

            <div className="grid gap-2 flex-1">
              <Label htmlFor="avatar-input">Аватар</Label>
              <Input
                id="avatar-input"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>
          </div>

          {/* Имя и Фамилия */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Имя</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Иван" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="surname">Фамилия</Label>
              <Input id="surname" name="surname" value={formData.surname} onChange={handleChange} placeholder="Иванов" required />
            </div>
          </div>

          {/* Email и Телефон */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+79991234567" required />
            </div>
          </div>

          {/* Ссылки */}
          <div className="grid gap-4">
            <Label>Ссылки на соцсети</Label>
            {formData.links.map((link, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder="Платформа (напр. GitHub)"
                  value={link.platform}
                  onChange={(e) => handleLinkChange(index, 'platform', e.target.value)}
                />
                <Input
                  type="url"
                  placeholder="https://github.com/username"
                  value={link.link}
                  onChange={(e) => handleLinkChange(index, 'link', e.target.value)}
                />
                <Button type="button" variant="destructive" size="icon" onClick={() => removeLink(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addLink}
            >
              + Добавить ссылку
            </Button>
          </div>
        </CardContent>
        <CardFooter className="mt-[10px]">
          <Button className="mx-auto" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
