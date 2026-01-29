import { FiLoader } from 'react-icons/fi';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export default function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <FiLoader className={`${sizes[size]} animate-spin text-slate-600`} />
      {text && <p className="text-sm text-slate-500">{text}</p>}
    </div>
  );
};
