import { CompraDetalle } from './../_model/compra-detalle';
import { Insumo } from 'src/app/_model/insumo';
import { Compra } from './../_model/compra';
export class CompraDto{
  compra: Compra
  compraDetalles: CompraDetalle[]

}
