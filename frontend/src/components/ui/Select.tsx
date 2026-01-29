import type { SelectHTMLAttributes } from 'react';

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  error?: string;
  placeholder?: string;
}

export default function Select({ label, options, error, placeholder = 'Seleccione una opción', className = '', ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700">
        {label}
        {props.required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <select
        className={`
          w-full px-3 py-2 border rounded-lg text-slate-900 bg-white
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent
          disabled:bg-slate-50 disabled:text-slate-500
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'}
          ${className}
        `}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
