import api from './api';
import type { Beneficiario, BeneficiarioFormData } from '../types';

export async function getAllBeneficiarios(): Promise<Beneficiario[]> {
  const response = await api.get<Beneficiario[]>('/beneficiarios');
  return response.data;
}

export async function getBeneficiarioById(id: number): Promise<Beneficiario> {
  const response = await api.get<Beneficiario>(`/beneficiarios/${id}`);
  return response.data;
}

export async function createBeneficiario(data: BeneficiarioFormData): Promise<Beneficiario> {
  const response = await api.post<Beneficiario>('/beneficiarios', data);
  return response.data;
}

export async function updateBeneficiario(id: number, data: BeneficiarioFormData): Promise<Beneficiario> {
  const response = await api.put<Beneficiario>(`/beneficiarios/${id}`, { id, ...data });
  return response.data;
}

export async function deleteBeneficiario(id: number): Promise<void> {
  await api.delete(`/beneficiarios/${id}`);
}
