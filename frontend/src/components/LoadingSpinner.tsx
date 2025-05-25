import { FC } from 'react';

interface LoadingSpinnerProps {
  /**
   * Текст под индикатором
   * @default "Загрузка..."
   */
  text?: string;
  /**
   * Размер spinner в пикселах
   * @default 12 (h-12 w-12 в Tailwind)
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Ц spinner
   * @default "primary" (синий)
   */
  color?: 'primary' | 'secondary' | 'danger' | 'success';
  /**
   * Дополнительные классы для контейнера
   */
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
  xl: 'h-20 w-20',
};

const colorClasses = {
  primary: 'border-t-gray-600 border-b-white-100',
  secondary: 'border-t-purple-600 border-b-purple-100',
  danger: 'border-t-red-600 border-b-red-100',
  success: 'border-t-green-600 border-b-green-100',
};

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  text = 'Загрузка...',
  size = 'md',
  color = 'primary',
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <div
        className={`animate-spin rounded-full border-4 ${sizeClasses[size]} ${colorClasses[color]}`}
      />
      {text && <p className="text-gray-600 dark:text-gray-300">{text}</p>}
    </div>
  );
};

export const FullPageLoader: FC<LoadingSpinnerProps> = (props) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80">
    <LoadingSpinner {...props} />
  </div>
);
