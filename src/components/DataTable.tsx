import type { ReactNode } from 'react';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  loading?: boolean;
}

export function DataTable<T extends { id: any }>({ columns, data, onEdit, onDelete, loading }: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-r-transparent"></div>
        <p className="mt-2 text-sm text-gray-500">Cargando...</p>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
        No hay registros
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            {columns.map(col => (
              <th key={col.key} className="px-4 py-3 text-left font-medium text-gray-600">
                {col.header}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-4 py-3 text-right font-medium text-gray-600">Acciones</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y">
          {data.map((item, i) => (
            <tr key={item.id ?? i} className="hover:bg-gray-50 transition-colors">
              {columns.map(col => (
                <td key={col.key} className="px-4 py-3">
                  {col.render ? col.render(item) : String((item as any)[col.key] ?? '')}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-4 py-3 text-right space-x-2">
                  {onEdit && (
                    <button onClick={() => onEdit(item)} className="text-blue-600 hover:underline text-xs font-medium">
                      Editar
                    </button>
                  )}
                  {onDelete && (
                    <button onClick={() => onDelete(item)} className="text-red-600 hover:underline text-xs font-medium">
                      Eliminar
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}