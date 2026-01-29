import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export default function Input({ label, error, hint, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700">
        {label}
        {props.required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        className={`
          w-full px-3 py-2 border rounded-lg text-slate-900 placeholder:text-slate-400
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent
          disabled:bg-slate-50 disabled:text-slate-500
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'}
          ${className}
        `}
        {...props}
      />
      {hint && !error && (
        <p className="text-xs text-slate-500">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
