import { Injectable } from '@angular/core';
import { PedidoDetalle } from '../_model/pedido-detalle';
import { GenericService } from './generic.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PedidoDetalleService extends GenericService<PedidoDetalle>{

  pedidoDetalleCambio = new Subject<PedidoDetalle[]>();
  mensajeCambio = new Subject<string>();

 constructor(protected http: HttpClient) {
   super(
     http,
     `${environment.HOST}/pedidos-detalle`);
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

 setPedidoDetalleCambio(lista: PedidoDetalle[]){
   this.pedidoDetalleCambio.next(lista);
 }

 getPedidoDetalleCambio(){
   return this.pedidoDetalleCambio.asObservable();
 }
 listarPedidosDetalle(id: number) {
  return this.http.get<PedidoDetalle[]>(`${this.url}/${id}`);
}

}

