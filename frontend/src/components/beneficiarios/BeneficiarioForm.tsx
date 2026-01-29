import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import useDocumentos from '../../hooks/useDocumentos';
import { createBeneficiarioSchema } from '../../schemas/beneficiario.schema';
import type { Beneficiario, BeneficiarioFormData, DocumentoIdentidad } from '../../types';

// Valor especial para indicar que no se ha seleccionado un documento
const NO_DOCUMENTO_SELECCIONADO = -1;

interface BeneficiarioFormProps {
  beneficiario?: Beneficiario | null;
  onSubmit: (data: BeneficiarioFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function BeneficiarioForm({ beneficiario, onSubmit, onCancel, isLoading = false }: BeneficiarioFormProps) {
  const { data: documentos = [], isLoading: loadingDocumentos } = useDocumentos();
  const [documentoIdSeleccionado, setDocumentoIdSeleccionado] = useState<number>(NO_DOCUMENTO_SELECCIONADO);

  // Buscar documento seleccionado por ID
  const documentoSeleccionado: DocumentoIdentidad | null = useMemo(() => {
    if (documentoIdSeleccionado === NO_DOCUMENTO_SELECCIONADO) return null;
    return documentos.find((d) => d.id === documentoIdSeleccionado) || null;
  }, [documentoIdSeleccionado, documentos]);

  // Schema dinamico basado en el documento seleccionado
  const schema = useMemo(
    () => createBeneficiarioSchema(documentoSeleccionado),
    [documentoSeleccionado]
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm<BeneficiarioFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombres: '',
      apellidos: '',
      documentoIdentidadId: NO_DOCUMENTO_SELECCIONADO,
      numeroDocumento: '',
      fechaNacimiento: '',
      sexo: 'M',
    },
  });

  const numeroDocumento = watch('numeroDocumento');
  const sexo = watch('sexo');

  // Cuando se edita un beneficiario, cargar sus datos
  useEffect(() => {
    if (beneficiario && documentos.length > 0) {
      setDocumentoIdSeleccionado(beneficiario.documentoIdentidadId);
      reset({
        nombres: beneficiario.nombres,
        apellidos: beneficiario.apellidos,
        documentoIdentidadId: beneficiario.documentoIdentidadId,
        numeroDocumento: beneficiario.numeroDocumento,
        fechaNacimiento: beneficiario.fechaNacimiento.split('T')[0],
        sexo: beneficiario.sexo,
      });
    }
  }, [beneficiario, documentos, reset]);

  // Cuando se resetea el formulario (nuevo beneficiario), limpiar seleccion
  useEffect(() => {
    if (!beneficiario) {
      setDocumentoIdSeleccionado(NO_DOCUMENTO_SELECCIONADO);
    }
  }, [beneficiario]);

  // Revalidar cuando cambia el documento seleccionado
  useEffect(() => {
    if (numeroDocumento) {
      trigger('numeroDocumento');
    }
  }, [documentoSeleccionado, trigger, numeroDocumento]);

  // Opciones para el select de documentos, ordenadas por ID
  const documentoOptions = useMemo(() => {
    return documentos
      .slice()
      .sort((a, b) => a.id - b.id)
      .map((doc) => ({
        value: doc.id,
        label: `${doc.abreviatura} - ${doc.nombre} (${doc.pais})`,
      }));
  }, [documentos]);

  const handleDocumentoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const id = value === '' ? NO_DOCUMENTO_SELECCIONADO : Number(value);
    setDocumentoIdSeleccionado(id);
    setValue('documentoIdentidadId', id);
    setValue('numeroDocumento', '');
  };

  const handleSexoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue('sexo', e.target.value as 'M' | 'F');
  };

  const getDocumentoHint = () => {
    if (!documentoSeleccionado) return undefined;
    const tipo = documentoSeleccionado.soloNumeros ? 'solo numeros' : 'alfanumerico';
    return `${documentoSeleccionado.longitud} caracteres, ${tipo}`;
  };

  const handleFormSubmit = handleSubmit((data) => {
    onSubmit({
      ...data,
      documentoIdentidadId: documentoIdSeleccionado,
    });
  });

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nombres"
          placeholder="Ingrese los nombres"
          {...register('nombres')}
          error={errors.nombres?.message}
          required
        />
        <Input
          label="Apellidos"
          placeholder="Ingrese los apellidos"
          {...register('apellidos')}
          error={errors.apellidos?.message}
          required
        />
      </div>

      <Select
        label="Tipo de Documento"
        options={documentoOptions}
        placeholder={loadingDocumentos ? 'Cargando...' : 'Seleccione un tipo de documento'}
        value={documentoIdSeleccionado === NO_DOCUMENTO_SELECCIONADO ? '' : documentoIdSeleccionado}
        onChange={handleDocumentoChange}
        error={errors.documentoIdentidadId?.message}
        required
      />

      <Input
        label="Numero de Documento"
        placeholder={documentoSeleccionado ? `Ingrese ${documentoSeleccionado.longitud} caracteres` : 'Seleccione un tipo de documento primero'}
        {...register('numeroDocumento')}
        error={errors.numeroDocumento?.message}
        hint={getDocumentoHint()}
        maxLength={documentoSeleccionado?.longitud}
        disabled={!documentoSeleccionado}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Fecha de Nacimiento"
          type="date"
          {...register('fechaNacimiento')}
          error={errors.fechaNacimiento?.message}
          required
        />
        <Select
          label="Sexo"
          options={[
            { value: 'M', label: 'Masculino' },
            { value: 'F', label: 'Femenino' },
          ]}
          value={sexo}
          onChange={handleSexoChange}
          error={errors.sexo?.message}
          required
        />
      </div>

      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-200">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {beneficiario ? 'Actualizar' : 'Crear'} Beneficiario
        </Button>
      </div>
    </form>
  );
}
