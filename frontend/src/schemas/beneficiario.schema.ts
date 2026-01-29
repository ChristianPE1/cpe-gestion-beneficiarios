import { z } from 'zod';
import type { DocumentoIdentidad } from '../types';

// Schema base sin validacion de documento
const beneficiarioBaseSchema = z.object({
  nombres: z
    .string()
    .min(1, 'Los nombres son requeridos')
    .max(100, 'Los nombres no pueden exceder 100 caracteres'),
  apellidos: z
    .string()
    .min(1, 'Los apellidos son requeridos')
    .max(100, 'Los apellidos no pueden exceder 100 caracteres'),
  documentoIdentidadId: z
    .number({ message: 'Seleccione un tipo de documento' })
    .int()
    .min(1, 'Seleccione un tipo de documento'),
  fechaNacimiento: z
    .string()
    .min(1, 'La fecha de nacimiento es requerida'),
  sexo: z.enum(['M', 'F'], {
    message: 'Seleccione el sexo',
  }),
});

// Funcion para crear schema con validacion dinamica de documento
export function createBeneficiarioSchema(documento: DocumentoIdentidad | null) {
  return beneficiarioBaseSchema.extend({
    numeroDocumento: z
      .string()
      .min(1, 'El numero de documento es requerido')
      .refine(
        (val) => {
          if (!documento) return true;
          return val.length === documento.longitud;
        },
        {
          message: documento
            ? `Debe tener exactamente ${documento.longitud} caracteres`
            : 'Seleccione un tipo de documento primero',
        }
      )
      .refine(
        (val) => {
          if (!documento) return true;
          if (documento.soloNumeros) {
            return /^\d+$/.test(val);
          }
          return true;
        },
        {
          message: 'Solo debe contener numeros',
        }
      ),
  });
}

// Tipo inferido del schema
export type BeneficiarioSchemaType = z.infer<ReturnType<typeof createBeneficiarioSchema>>;
