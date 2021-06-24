import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Subject } from 'rxjs';
import { CategoriaInsumo } from './../_model/categoria-insumo';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoriaInsumoService extends GenericService<CategoriaInsumo>{

   categoriaInsumoCambio = new Subject<CategoriaInsumo[]>();
   mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/categoria-insumos`);
  }

  listarPageable(p: number, s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  /* get, set */
  setMensajeCambio(mensaje: string){
    this.mensajeCambio.next(mensaje);
  }

  getMensajeCambio(){
    return this.mensajeCambio.asObservable();
  }

  setCategoriaInsumoCambio(lista: CategoriaInsumo[]){
    this.categoriaInsumoCambio.next(lista);
  }

  getCategoriaInsumoCambio(){
    return this.categoriaInsumoCambio.asObservable();
  }


}
