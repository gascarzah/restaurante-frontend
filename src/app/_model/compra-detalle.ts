import { Insumo } from 'src/app/_model/insumo';
import { Compra } from './compra';
export class CompraDetalle{
  idCompraDetalle: number
  precioUnidad: number
  stock: number
  compra: Compra
  insumo: Insumo
  cantidad: number
  total: number
}
