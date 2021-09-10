import { Empleado } from './empleado';
import { Pedido } from './pedido';
import { Cliente } from "./cliente"
import { TipoRecibo } from './tipo-recibo';

 export class Venta{

  idVenta: number
  numVenta: string
  // cliente: Cliente
  // empleado: Empleado
  pedido: Pedido
  tipoRecibo: TipoRecibo
  total: number
  efectivo: number
  visa: number
  mastercard: number

}
