import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../api/client';
import type { Bodega, CreateBodegaDto } from '../types';

export function useBodegas() {
  const queryClient = useQueryClient();

  const { data: bodegas = [], isLoading } = useQuery({
    queryKey: ['bodegas'],
    queryFn: async () => {
      const res = await api.get<Bodega[]>('/bodegas');
      return res.data;
    },
  });

  const crear = useMutation({
    mutationFn: (dto: CreateBodegaDto) => api.post('/bodegas', dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bodegas'] });
      toast.success('Bodega creada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al crear bodega');
    },
  });

  const actualizar = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: Partial<CreateBodegaDto> }) =>
      api.patch(`/bodegas/${id}`, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bodegas'] });
      toast.success('Bodega actualizada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al actualizar bodega');
    },
  });

  const eliminar = useMutation({
    mutationFn: (id: number) => api.delete(`/bodegas/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bodegas'] });
      toast.success('Bodega eliminada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al eliminar bodega');
    },
  });

  return { bodegas, isLoading, crear, actualizar, eliminar };
}