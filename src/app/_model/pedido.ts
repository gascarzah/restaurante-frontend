import { Empleado } from 'src/app/_model/empleado';
import { Cliente } from 'src/app/_model/cliente';
import { Mesa } from './mesa';
export class Pedido{
  idPedido: number;
  // mesa: Mesa[]
  total: number;
  cliente: Cliente
  empleado: Empleado
  expandible: boolean
  estado: number;

}
