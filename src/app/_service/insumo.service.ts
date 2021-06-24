import { Insumo } from 'src/app/_model/insumo';

import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';

import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class InsumoService extends GenericService<Insumo>{

   insumoCambio = new Subject<Insumo[]>();
   mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/insumos`);
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

  setInsumoCambio(lista: Insumo[]){
    this.insumoCambio.next(lista);
  }

  getInsumoCambio(){
    return this.insumoCambio.asObservable();
  }


}
