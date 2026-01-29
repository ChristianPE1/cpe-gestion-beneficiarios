import { useState } from 'react';
import { FiPlus, FiSearch, FiUsers } from 'react-icons/fi';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import BeneficiarioForm from '../components/beneficiarios/BeneficiarioForm';
import BeneficiarioCard from '../components/beneficiarios/BeneficiarioCard';
import {
  useBeneficiarios,
  useCreateBeneficiario,
  useUpdateBeneficiario,
  useDeleteBeneficiario,
} from '../hooks/useBeneficiarios';
import type { Beneficiario, BeneficiarioFormData } from '../types';

export default function BeneficiariosPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBeneficiario, setSelectedBeneficiario] = useState<Beneficiario | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Beneficiario | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: beneficiarios = [], isLoading, error } = useBeneficiarios();
  const createMutation = useCreateBeneficiario();
  const updateMutation = useUpdateBeneficiario();
  const deleteMutation = useDeleteBeneficiario();

  const filteredBeneficiarios = beneficiarios.filter((b) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      b.nombres.toLowerCase().includes(searchLower) ||
      b.apellidos.toLowerCase().includes(searchLower) ||
      b.numeroDocumento.toLowerCase().includes(searchLower)
    );
  });

  const handleCreate = () => {
    setSelectedBeneficiario(null);
    setIsFormOpen(true);
  };

  const handleEdit = (beneficiario: Beneficiario) => {
    setSelectedBeneficiario(beneficiario);
    setIsFormOpen(true);
  };

  const handleDelete = (beneficiario: Beneficiario) => {
    setDeleteTarget(beneficiario);
  };

  const handleFormSubmit = async (data: BeneficiarioFormData) => {
    try {
      if (selectedBeneficiario) {
        await updateMutation.mutateAsync({ id: selectedBeneficiario.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      setIsFormOpen(false);
      setSelectedBeneficiario(null);
    } catch (error) {
      console.error('Error al guardar beneficiario:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    } catch (error) {
      console.error('Error al eliminar beneficiario:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Cargando beneficiarios..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600">Error al cargar los beneficiarios</p>
        <p className="text-sm text-red-500 mt-1">Por favor, intente nuevamente</p>
      </div>
    );
  }

  return (
    <div className='grid min-h-[85vh] grid-rows-[auto_1fr_auto]'>
      {/* Page Header */}
      <header>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Beneficiarios</h1>
            <p className="text-slate-500 mt-1">Gestiona los beneficiarios del programa social</p>
          </div>
          <Button leftIcon={<FiPlus className="w-4 h-4" />} onClick={handleCreate}>
            Nuevo Beneficiario
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o documento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          />
        </div>
      </header>
      <main>
      {/* Beneficiarios Grid */}
      {filteredBeneficiarios.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUsers className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">
            {searchTerm ? 'No se encontraron resultados' : 'No hay beneficiarios'}
          </h3>
          <p className="text-slate-500 mt-1">
            {searchTerm
              ? 'Intente con otros términos de búsqueda'
              : 'Comienza agregando un nuevo beneficiario'}
          </p>
          {!searchTerm && (
            <Button
              leftIcon={<FiPlus className="w-4 h-4" />}
              onClick={handleCreate}
              className="mt-4"
            >
              Agregar Beneficiario
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBeneficiarios.map((beneficiario) => (
            <BeneficiarioCard
              key={beneficiario.id}
              beneficiario={beneficiario}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="mt-6 text-sm text-slate-500">
        {filteredBeneficiarios.length} de {beneficiarios.length} beneficiarios
      </div>
      </main>

      {/* Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedBeneficiario(null);
        }}
        title={selectedBeneficiario ? 'Editar Beneficiario' : 'Nuevo Beneficiario'}
      >
        <BeneficiarioForm
          beneficiario={selectedBeneficiario}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsFormOpen(false);
            setSelectedBeneficiario(null);
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Beneficiario"
        message={`¿Está seguro de eliminar a ${deleteTarget?.nombres} ${deleteTarget?.apellidos}? Esta acción no se puede deshacer.`}
        isLoading={deleteMutation.isPending}
      />
      {/* Footer */}
      <footer className="w-full text-center flex items-center justify-center h-16 text-sm text-slate-400 ">
        &copy; {new Date().getFullYear()} Christian Pardavé Espinoza. Casi todos los derechos reservados.
      </footer>
    </div>
  );
}
