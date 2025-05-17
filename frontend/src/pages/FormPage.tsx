import { AdForm } from '@/components/AdForm';
import { Ad } from '@/types/ad';

function FormPage() {
  const initialData: Ad = {
    title: '',
    description: '',
    price: 0,
    category: '',
    city: '',
    user: 'currentUserId', // заменить на реального пользователя
    images: [],
    isSold: false,
    createdAt: 'Sun Jan 27 2013 11:00:00 GMT+0400 (Москва, стандартное время)',
    updatedAt: 'Sun Jan 27 2023 11:00:00 GMT+0400 (Москва, стандартное время)',
  };

  return (
    <>
      <div className="flex flex-col gap-6 w-fit mx-auto p-6">
        <AdForm
          onSubmit={(data) => console.log(data)}
          categories={['1', '2']}
          cities={['perm', 'moscow']}
        />
        <AdForm
          initialData={initialData}
          onSubmit={(data) => console.log(data)}
          categories={['1', '2']}
          cities={['perm', 'moscow']}
        />
      </div>
    </>
  );
}

export default FormPage;
