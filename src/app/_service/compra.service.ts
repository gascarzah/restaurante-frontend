import { CompraDto } from './../_dto/compraDto';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { GenericService } from './generic.service';
import { Subject } from 'rxjs';
import { Compra } from './../_model/compra';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CompraService extends GenericService<Compra>{

  compraCambio = new Subject<Compra[]>();
  mensajeCambio = new Subject<string>();

 constructor(protected http: HttpClient) {
   super(
     http,
     `${environment.HOST}/compras`);
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

 setCompraCambio(lista: Compra[]){
   this.compraCambio.next(lista);
 }

 getCompraCambio(){
   return this.compraCambio.asObservable();
 }

 registrarTransaccion(compraDto: CompraDto) {
  return this.http.post(this.url, compraDto);
}
}
