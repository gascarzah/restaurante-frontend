import { Medida } from './medida';
import { CategoriaInsumo } from './categoria-insumo';
import { Unidad } from './unidad';
export class Insumo{
  idInsumo: number
  descripcion: string
  cantidadPorMedida: number
  precioSugerido: number
  stockMinimo: number
  categoriaInsumo: CategoriaInsumo
  medida: Medida
  unidad: Unidad
}
