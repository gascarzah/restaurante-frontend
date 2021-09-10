import { ProductoDetalle } from './producto-detalle';

import { CategoriaProducto } from "./categoria-producto";
import { Destino } from "./destino";

export class Producto{
  idProducto: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoriaProducto: CategoriaProducto;
  destino: Destino;
  stock: number;
}
