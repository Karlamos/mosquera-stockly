import { useState } from 'react';
import { useBodegas } from '../../store/useBodegas';
import type { Bodega } from '../../types';
import { DataTable } from '../../components/DataTable';
import { Modal } from '../../components/Modal';
import { Button } from '../../components/Button';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Plus } from 'lucide-react';

const emptyForm = { nombre: '', ubicacion: '', isPrincipal: false };

export default function BodegasPage() {
  const { bodegas, isLoading, crear, actualizar, eliminar } = useBodegas();
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editing, setEditing] = useState<Bodega | null>(null);
  const [deleting, setDeleting] = useState<Bodega | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (item: Bodega) => {
    setEditing(item);
    setForm({ nombre: item.nombre, ubicacion: item.ubicacion, isPrincipal: item.isPrincipal });
    setModalOpen(true);
  };

  const openDelete = (item: Bodega) => {
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
    { key: 'ubicacion', header: 'Ubicación' },
    {
      key: 'isPrincipal',
      header: 'Principal',
      render: (item: Bodega) => (
        <span className={item.isPrincipal ? 'text-green-600 font-medium' : 'text-gray-400'}>
          {item.isPrincipal ? 'Sí' : 'No'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bodegas</h1>
        <Button onClick={openCreate}>
          <Plus size={16} className="inline mr-1" /> Nueva
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={bodegas}
        loading={isLoading}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar Bodega' : 'Nueva Bodega'}
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nombre</label>
            <input
              placeholder="Ej: Bodega Central"
              value={form.nombre}
              onChange={e => setForm({ ...form, nombre: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Ubicación</label>
            <input
              placeholder="Ej: Quito, Ecuador"
              value={form.ubicacion}
              onChange={e => setForm({ ...form, ubicacion: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPrincipal"
              checked={form.isPrincipal}
              onChange={e => setForm({ ...form, isPrincipal: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="isPrincipal" className="text-sm text-gray-600">
              Bodega principal
            </label>
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
        title="Eliminar bodega"
        message={`¿Estás seguro de eliminar la bodega "${deleting?.nombre}"? El inventario asociado podría verse afectado.`}
        loading={eliminar.isPending}
      />
    </div>
  );
}