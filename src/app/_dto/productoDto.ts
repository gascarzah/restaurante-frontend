import { ProductoDetalle } from './../_model/producto-detalle';
import { Producto } from './../_model/producto';
export class ProductoDto{
  producto: Producto
  productoDetalles: ProductoDetalle[]
}
