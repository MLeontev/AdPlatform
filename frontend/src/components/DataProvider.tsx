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

const STORAGE_KEYS = {
  CATEGORIES: 'app_categories',
  CITIES: 'app_cities',
};

const saveToLocalStorage = <T,>(key: string, data: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save data to localStorage', error);
  }
};

const loadFromLocalStorage = <T,>(key: string): T | null => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load data from localStorage', error);
    return null;
  }
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<AppData | null>(() => {
    return {
      categories: loadFromLocalStorage<Category[]>(STORAGE_KEYS.CATEGORIES),
      cities: loadFromLocalStorage<City[]>(STORAGE_KEYS.CITIES),
    };
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const shouldFetchCategories = !loadFromLocalStorage(
          STORAGE_KEYS.CATEGORIES,
        );
        const shouldFetchCities = !loadFromLocalStorage(STORAGE_KEYS.CITIES);

        if (shouldFetchCategories || shouldFetchCities) {
          const [categories, cities] = await Promise.all([
            shouldFetchCategories ? getCategories() : Promise.resolve(null),
            shouldFetchCities ? getCities() : Promise.resolve(null),
          ]);

          const newData = {
            categories: categories ?? data?.categories ?? null,
            cities: cities ?? data?.cities ?? null,
          };

          setData(newData);

          if (categories) saveToLocalStorage(STORAGE_KEYS.CATEGORIES, categories);
          if (cities) saveToLocalStorage(STORAGE_KEYS.CITIES, cities);
        }
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