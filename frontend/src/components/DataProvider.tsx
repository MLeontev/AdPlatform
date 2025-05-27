import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getCategories } from '@/api/categories.ts';
import { getCities } from '@/api/cities.ts';
import { Category } from '@/types/category.ts';
import { City } from '@/types/city.ts';

type AppData = {
  categories: Category[] | null;
  cities: City[] | null;
};

const DataContext = createContext<AppData | null>(null);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<AppData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categories, cities] = await Promise.all([
          getCategories(),
          getCities(),
        ]);

        setData({ categories, cities });
      } catch (error) {
        console.error('Failed to fetch initial data', error);
      }
    };

    fetchData().then();
  }, []);

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

export const useAppData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within a DataProvider');
  }
  return context;
};
