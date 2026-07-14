import { useState } from 'react';
import { useCategorias } from '../../store/useCategorias';
import type { Categoria } from '../../types';
import { DataTable } from '../../components/DataTable';
import { Modal } from '../../components/Modal';
import { Button } from '../../components/Button';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Plus } from 'lucide-react';

const emptyForm = { nombre: '', prefijo: '' };

export default function CategoriasPage() {
  const { categorias, isLoading, crear, actualizar, eliminar } = useCategorias();
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editing, setEditing] = useState<Categoria | null>(null);
  const [deleting, setDeleting] = useState<Categoria | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (item: Categoria) => {
    setEditing(item);
    setForm({ nombre: item.nombre, prefijo: item.prefijo });
    setModalOpen(true);
  };

  const openDelete = (item: Categoria) => {
    setDeleting(item);
    setConfirmOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await actualizar.mutateAsync({ id: editing.id, dto: form });
    } else {
      await crear.mutateAsync(form);
    }
    setModalOpen(false);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    await eliminar.mutateAsync(deleting.id);
    setConfirmOpen(false);
    setDeleting(null);
  };

  const columns = [
    { key: 'nombre', header: 'Nombre' },
    { key: 'prefijo', header: 'Prefijo' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categorías</h1>
        <Button onClick={openCreate}>
          <Plus size={16} className="inline mr-1" /> Nueva
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={categorias}
        loading={isLoading}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar Categoría' : 'Nueva Categoría'}
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nombre</label>
            <input
              placeholder="Ej: Ferretería"
              value={form.nombre}
              onChange={e => setForm({ ...form, nombre: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Prefijo</label>
            <input
              placeholder="Ej: FER"
              value={form.prefijo}
              onChange={e => setForm({ ...form, prefijo: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              maxLength={10}
              required
            />
            <p className="text-xs text-gray-400 mt-1">Máximo 10 caracteres. Se usa para generar el SKU.</p>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={crear.isPending || actualizar.isPending}>
              {editing ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Eliminar categoría"
        message={`¿Estás seguro de eliminar la categoría "${deleting?.nombre}"? Los materiales asociados podrían verse afectados.`}
        loading={eliminar.isPending}
      />
    </div>
  );
}