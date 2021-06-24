import { GenericService } from './generic.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Mesa } from './../_model/mesa';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MesaService extends GenericService<Mesa>{

   mesaCambio = new Subject<Mesa[]>();
   mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/mesas`);
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

  setMesaCambio(lista: Mesa[]){
    this.mesaCambio.next(lista);
  }

  getMesaCambio(){
    return this.mesaCambio.asObservable();
  }


}
