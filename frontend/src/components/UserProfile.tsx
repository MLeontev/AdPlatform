import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { UserDto } from '@/types/DTOs/userDto.ts';
import { Link } from 'react-router-dom';
import AdFeed from '@/components/AdFeed.tsx';
import { useState } from 'react';

interface UserProfileProps {
  user: UserDto;
  onCreateAd: () => void;
}

export function UserProfile({ user, onCreateAd }: UserProfileProps) {
  const [adsCount, setAdsCount] = useState(0);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Левая колонка - информация о пользователе */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader className="flex flex-col items-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage
                  className="rounded-full object-cover"
                  src={user.avatarSrc}
                  alt={`${user.name} ${user.surname}`}
                />
                <AvatarFallback>
                  {user.name.charAt(0)}
                  {user.surname.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">
                {user.name} {user.surname}
              </CardTitle>
              <p className="text-sm text-gray-500">
                Зарегистрирован: {formatDate(user.registrationDate)}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Контактная информация</h3>
                {user.phone && (
                  <p className="text-sm mt-2">
                    Телефон: <span className="font-medium">{user.phone}</span>
                  </p>
                )}
                {user.email && (
                  <p className="text-sm mt-1">
                    Email: <span className="font-medium">{user.email}</span>
                  </p>
                )}
              </div>

              {user.links.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Социальные сети</h3>
                  <div className="flex flex-wrap gap-3">
                    {user.links.map((link) => (
                      <a
                        key={link.platform}
                        href={link.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                      >
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {link.platform}
          </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="ml-1.5 h-4 w-4 text-gray-500 dark:text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Действия</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-rows-1 md:grid-rows-2 gap-4">
              <Button onClick={onCreateAd} className="w-full">
                Создать новое объявление
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/favorites">Избранные объявления</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Правая колонка - действия и объявления */}
        <div className="md:col-span-2 space-y-6">

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Мои объявления</CardTitle>
                <span className="text-sm text-gray-500">
                  Объявлений: {adsCount}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <AdFeed
                userId={user.id}
                isFullScreenOpened={false}
                adsCount={(count: number) => setAdsCount(count)}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
