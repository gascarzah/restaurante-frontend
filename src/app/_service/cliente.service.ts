import { Cliente } from './../_model/cliente';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { Subject } from 'rxjs';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService extends GenericService<Cliente>{

   clienteCambio = new Subject<Cliente[]>();
   mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/clientes`);
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

  setClienteCambio(lista: Cliente[]){
    this.clienteCambio.next(lista);
  }

  getClienteCambio(){
    return this.clienteCambio.asObservable();
  }

  // listarOrdenadoPorId(){
  //   return this.http.get<any>(`${this.url}/ordenId`);
  // }

}
