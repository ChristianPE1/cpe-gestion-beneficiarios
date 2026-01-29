import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllBeneficiarios, getBeneficiarioById, createBeneficiario, updateBeneficiario, deleteBeneficiario } from '../services/beneficiarios.service';
import type { BeneficiarioFormData } from '../types';

export function useBeneficiarios() {
  return useQuery({
    queryKey: ['beneficiarios'],
    queryFn: getAllBeneficiarios,
  });
}

export function useBeneficiario(id: number) {
  return useQuery({
    queryKey: ['beneficiario', id],
    queryFn: () => getBeneficiarioById(id),
    enabled: id > 0,
  });
}

export function useCreateBeneficiario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BeneficiarioFormData) => createBeneficiario(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beneficiarios'] });
    },
  });
}

export function useUpdateBeneficiario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: BeneficiarioFormData }) =>
      updateBeneficiario(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beneficiarios'] });
    },
  });
}

export function useDeleteBeneficiario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteBeneficiario(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beneficiarios'] });
    },
  });
}
