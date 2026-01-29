import { useQuery } from '@tanstack/react-query';
import { getDocumentosActivos } from '../services/documentos.service';

export default function useDocumentos() {
  return useQuery({
    queryKey: ['documentos'],
    queryFn: getDocumentosActivos,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
