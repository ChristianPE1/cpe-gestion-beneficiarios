import { Link, useLocation } from 'react-router-dom';
import { FiUsers } from 'react-icons/fi';

export default function Header() {
  const location = useLocation();

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <FiUsers className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-900">PowerMas</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'text-slate-900'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Beneficiarios
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
