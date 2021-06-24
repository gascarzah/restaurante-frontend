import { GenericService } from './generic.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Proveedor } from './../_model/proveedor';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService extends GenericService<Proveedor>{

   proveedorCambio = new Subject<Proveedor[]>();
   mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/proveedores`);
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

  setProveedorCambio(lista: Proveedor[]){
    this.proveedorCambio.next(lista);
  }

  getProveedorCambio(){
    return this.proveedorCambio.asObservable();
  }


}
