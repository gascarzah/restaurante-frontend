import { Producto } from 'src/app/_model/producto';
import { Venta } from './../_model/venta';
import { PedidoDetalle } from 'src/app/_model/pedido-detalle';
import { Pedido } from './../_model/pedido';
export class VentaDto{
  pedido: Pedido
  pedidoDetalles: PedidoDetalle[]
  venta: Venta
  productos: Producto[]
}
