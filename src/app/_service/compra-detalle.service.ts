import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { GenericService } from './generic.service';
import { CompraDetalle } from './../_model/compra-detalle';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompraDetalleService extends GenericService<CompraDetalle>{

  compraDetalleCambio = new Subject<CompraDetalle[]>();
  mensajeCambio = new Subject<string>();

 constructor(protected http: HttpClient) {
   super(
     http,
     `${environment.HOST}/compras-detalle`);
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

 setCompraDetalleCambio(lista: CompraDetalle[]){
   this.compraDetalleCambio.next(lista);
 }

 getCompraDetalleCambio(){
   return this.compraDetalleCambio.asObservable();
 }
 listarComprasDetalle(id: number) {
  return this.http.get<CompraDetalle[]>(`${this.url}/${id}`);
}

}

