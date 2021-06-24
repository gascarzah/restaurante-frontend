import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { GenericService } from './generic.service';
import { ProductoDetalle } from './../_model/producto-detalle';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductoDetalleService extends GenericService<ProductoDetalle>{

  productoDetalleCambio = new Subject<ProductoDetalle[]>();
  mensajeCambio = new Subject<string>();

 constructor(protected http: HttpClient) {
   super(
     http,
     `${environment.HOST}/productos-detalle`);
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

 setProductoDetalleCambio(lista: ProductoDetalle[]){
   this.productoDetalleCambio.next(lista);
 }

 getProductoDetalleCambio(){
   return this.productoDetalleCambio.asObservable();
 }
 listarProductosDetalle(id: number) {
  return this.http.get<ProductoDetalle[]>(`${this.url}/${id}`);
}

}

