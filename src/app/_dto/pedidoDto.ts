import { Pedido } from '../_model/pedido';
import { PedidoDetalle } from '../_model/pedido-detalle';
import { Mesa } from '../_model/mesa';
export class PedidoDto{
  pedido: Pedido
  pedidoDetalles: PedidoDetalle[]
  mesas: Mesa[]
}
