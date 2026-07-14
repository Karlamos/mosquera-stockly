// ==================== AUTH ====================
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  data: {
    access_token: string;
    user: {
      id: string;
      username: string;
      rol: UserRole;
    };
  };
}

export type UserRole = 'ADMIN' | 'SOLICITANTE' | 'BODEGUERO' | 'COMPRADOR';

// ==================== USERS ====================
export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: UserRole;
  estado: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  rol: UserRole;
  is_active?: boolean;
  bodega_id?: number;
}

// ==================== BODEGAS ====================
export interface Bodega {
  id: number;
  nombre: string;
  ubicacion: string;
  isPrincipal: boolean;
  proyectoId?: string;
}

export interface CreateBodegaDto {
  nombre: string;
  ubicacion: string;
  isPrincipal?: boolean;
  proyectoId?: string;
}

// ==================== CATEGORIAS ====================
export interface Categoria {
  id: number;
  nombre: string;
  prefijo: string;
}

export interface CreateCategoriaDto {
  nombre: string;
  prefijo: string;
}

// ==================== MATERIALES ====================
export type UnidadMedida = 'U' | 'KG' | 'M' | 'M2';

export interface Material {
  id: number;
  nombre: string;
  descripcion?: string;
  sku: string;
  unidad_medida: UnidadMedida;
  categoria_id?: number;
  categoria?: Categoria;
}

export interface CreateMaterialDto {
  nombre: string;
  descripcion?: string;
  unidad_medida: UnidadMedida;
  categoria_id: number;
}

// ==================== INVENTARIO ====================
export interface Inventario {
  id: number;
  material_id: number;
  bodega_id: number;
  cantidad_disponible: number;
  cantidad_reservada: number;
  material?: Material;
  bodega?: Bodega;
}

// ==================== PROVEEDORES ====================
export interface Proveedor {
  id: number;
  ruc: string;
  razon_social: string;
  email: string;
  telefono?: string;
  direccion?: string;
  estado: boolean;
}

export interface CreateProveedorDto {
  ruc: string;
  razon_social: string;
  email: string;
  telefono?: string;
  direccion?: string;
}

// ==================== PROYECTOS ====================
export type EstadoProyecto = 'ACTIVO' | 'CERRADO';

export interface Proyecto {
  id: string;
  nombre: string;
  codigoProyecto: string;
  fechaInicio: string;
  estado: EstadoProyecto;
}

export interface CreateProyectoDto {
  nombre: string;
  codigoProyecto?: string;
  fechaInicio: string;
  estado?: EstadoProyecto;
}

// ==================== MOVIMIENTOS ====================
export type TipoMovimiento = 'INGRESO' | 'EGRESO' | 'TRANSFERENCIA';

export interface MovimientoDetalle {
  materialId: string;
  cantidad: number;
}

export interface CreateMovimientoDto {
  tipo: TipoMovimiento;
  observaciones?: string;
  bodegaOrigenId?: number;
  bodegaDestinoId?: number;
  detalles: MovimientoDetalle[];
}

export interface Movimiento {
  id: string;
  tipo: TipoMovimiento;
  fecha: string;
  observaciones?: string;
  estado: string;
  bodegaOrigenId?: number;
  bodegaDestinoId?: number;
  usuarioId: string;
}

// ==================== REQUIREMENTS ====================
export type RequirementStatus = 'PENDIENTE' | 'APROBADO' | 'PARCIALMENTE_ATENDIDO' | 'ATENDIDO' | 'RECHAZADO';

export interface RequirementDetalle {
  materialId: number;
  cantidadSolicitada: number;
  cantidadDespachada?: number;
  estadoItem?: string;
}

export interface Requirement {
  id: number;
  proyectoId: string;
  usuarioSolicitanteId: string;
  fechaSolicitud: string;
  estado: RequirementStatus;
  detalles?: RequirementDetalle[];
  proyecto?: Proyecto;
  usuarioSolicitante?: User;
}

export interface CreateRequirementDto {
  proyectoId: string;
  detalles: { materialId: number; cantidadSolicitada: number }[];
}

// ==================== COMPRAS ====================
export type EstadoOrden = 'BORRADOR' | 'EMITIDA' | 'RECIBIDA' | 'CANCELADA' | 'PENDIENTE';

export interface DetalleCompra {
  materialId: number;
  cantidad: number;
  precioUnitario: number;
}

export interface CreateCompraDto {
  proveedorId: number;
  fechaEmision?: string;
  subtotal?: number;
  impuestos?: number;
  total?: number;
  detalles?: DetalleCompra[];
}

export interface OrdenCompra {
  id: number;
  codigo: string;
  fechaEmision: string;
  estado: EstadoOrden;
  subtotal: number;
  impuestos: number;
  total: number;
  proveedor?: Proveedor;
}

// ==================== AJUSTES ====================
export interface DetalleAjuste {
  materialId: number;
  stockFisico: number;
}

export interface CreateAjusteDto {
  bodegaId: number;
  motivo: string;
  detalles: DetalleAjuste[];
}