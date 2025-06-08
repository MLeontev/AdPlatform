'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const LoginForm = () => {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // здесь обработка логина, например отправка на сервер
    console.log('Вход с:', form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-start justify-between w-fit h-fit p-6 rounded-lg border shadow-md mx-auto mt-10"
    >
      <Label className="text-2xl font-bold mb-6 ml-[10px]">Вход</Label>

      <Label className="ml-[10px]">Email</Label>
      <Input
        className="m-[10px] w-[300px]"
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="example@mail.com"
        required
      />

      <Label className="ml-[10px]">Пароль</Label>
      <Input
        className="m-[10px] w-[300px]"
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Ваш пароль"
        required
      />

      <Button type="submit" className="m-[10px]">
        Войти
      </Button>
    </form>
  );
};

export default LoginForm;