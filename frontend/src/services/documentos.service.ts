import api from './api';
import type { DocumentoIdentidad } from '../types';

export async function getDocumentosActivos(): Promise<DocumentoIdentidad[]> {
  const response = await api.get<DocumentoIdentidad[]>('/documentos');
  // Ordenar por ID para mantener el orden de la base de datos
  return response.data.sort((a, b) => a.id - b.id);
}

export async function getDocumentoById(id: number): Promise<DocumentoIdentidad> {
  const response = await api.get<DocumentoIdentidad>(`/documentos/${id}`);
  return response.data;
}
