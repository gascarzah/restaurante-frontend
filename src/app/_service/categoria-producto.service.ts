import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { GenericService } from './generic.service';
import { CategoriaProducto } from './../_model/categoria-producto';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaProductoService extends GenericService<CategoriaProducto>{

  categoriaProductoCambio = new Subject<CategoriaProducto[]>();
  mensajeCambio = new Subject<string>();

 constructor(protected http: HttpClient) {
   super(
     http,
     `${environment.HOST}/categoria-productos`);
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

 setCategoriaProductoCambio(lista: CategoriaProducto[]){
   this.categoriaProductoCambio.next(lista);
 }

 getCategoriaProductoCambio(){
   return this.categoriaProductoCambio.asObservable();
 }


}
