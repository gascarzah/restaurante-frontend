import { ProductoDto } from './../_dto/productoDto';
import { environment } from 'src/environments/environment';
import { Producto } from './../_model/producto';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductoService extends GenericService<Producto>{

  productoCambio = new Subject<Producto[]>();
  mensajeCambio = new Subject<string>();

 constructor(protected http: HttpClient) {
   super(
     http,
     `${environment.HOST}/productos`);
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

 setProductoCambio(lista: Producto[]){
   this.productoCambio.next(lista);
 }

 getProductoCambio(){
   return this.productoCambio.asObservable();
 }

 registrarTransaccion(productoDto: ProductoDto) {
  return this.http.post(this.url, productoDto);
}
}
