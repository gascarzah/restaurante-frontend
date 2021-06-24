import { Producto } from './producto';
export class PedidoDetalle{

  idPedidoDetalle: number;
  producto: Producto
  cantidad: number = 0
  observacion: string
}
