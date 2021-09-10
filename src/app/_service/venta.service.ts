import { environment } from './../../environments/environment';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Venta } from './../_model/venta';
import { Injectable } from '@angular/core';
import { VentaDto } from '../_dto/ventaDto';

@Injectable({
  providedIn: 'root'
})
export class VentaService extends GenericService<Venta>{

   ventaCambio = new Subject<Venta[]>();
   mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/ventas`);
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

  setVentaCambio(lista: Venta[]){
    this.ventaCambio.next(lista);
  }

  getVentaCambio(){
    return this.ventaCambio.asObservable();
  }

  registrarTransaccion(ventaDto: VentaDto) {
    return this.http.post(this.url, ventaDto);
  }
}
