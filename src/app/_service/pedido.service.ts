import { PedidoMesaDto } from './../_dto/pedidoMesaDto';
import { Injectable } from '@angular/core';
import { Pedido } from '../_model/pedido';
import { GenericService } from './generic.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PedidoDto } from '../_dto/pedidoDto';

@Injectable({
  providedIn: 'root'
})
export class PedidoService extends GenericService<Pedido>{

  pedidoCambio = new Subject<Pedido[]>();
  mensajeCambio = new Subject<string>();

 constructor(protected http: HttpClient) {
   super(
     http,
     `${environment.HOST}/pedidos`);
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

 setPedidoCambio(lista: Pedido[]){
   this.pedidoCambio.next(lista);
 }

 getPedidoCambio(){
   return this.pedidoCambio.asObservable();
 }

 registrarTransaccion(pedidoDto: PedidoDto) {
  return this.http.post(this.url, pedidoDto);
}

listarPorPedidoMesa(){
  return this.http.get<PedidoMesaDto[]>(`${this.url}/mesas`);
}

actualizarEstado(pedido: Pedido) {
  return this.http.post(`${this.url}/actualizarEstado`, pedido);
}
}

