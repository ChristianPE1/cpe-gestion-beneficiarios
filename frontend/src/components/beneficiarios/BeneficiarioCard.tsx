import { FiEdit2, FiTrash2, FiUser } from 'react-icons/fi';
import type { Beneficiario } from '../../types';

interface BeneficiarioCardProps {
  beneficiario: Beneficiario;
  onEdit: (beneficiario: Beneficiario) => void;
  onDelete: (beneficiario: Beneficiario) => void;
}

export default function BeneficiarioCard({ beneficiario, onEdit, onDelete }: BeneficiarioCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
            <FiUser className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <h3 className="font-medium text-slate-900">
              {beneficiario.nombres} {beneficiario.apellidos}
            </h3>
            <p className="text-sm text-slate-500">
              {beneficiario.abreviaturaDocumento}: {beneficiario.numeroDocumento}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(beneficiario)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Editar"
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(beneficiario)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Eliminar"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-slate-400 text-xs">País</p>
          <p className="text-slate-700">{beneficiario.pais}</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs">Nacimiento</p>
          <p className="text-slate-700">{formatDate(beneficiario.fechaNacimiento)}</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs">Sexo</p>
          <p className="text-slate-700">{beneficiario.sexo === 'M' ? 'Masculino' : 'Femenino'}</p>
        </div>
      </div>
    </div>
  );
};
