import { TipoRecibo } from './tipo-recibo';
import { Proveedor } from './proveedor';
export class Compra{
  idCompra: number
  codigoCompra: string
  proveedor: Proveedor
  tipoRecibo: TipoRecibo
  numeroRecibo: string
	observacion: string
	 valor: number
	igv: number
	total: number
}
