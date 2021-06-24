import { Insumo } from 'src/app/_model/insumo';
import { Unidad } from './unidad';
import { Producto } from './producto';


export class ProductoDetalle{
  idProductoDetalle: number;
  producto: Producto;
  cantidad: number;
  insumo: Insumo;
  unidad: Unidad;
}
