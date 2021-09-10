import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { TipoRecibo } from './../_model/tipo-recibo';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TipoReciboService extends GenericService<TipoRecibo>{

  private tiporeciboCambio = new Subject<TipoRecibo[]>();
  private mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/tipoRecibos`);
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

  setTipoReciboCambio(lista: TipoRecibo[]){
    this.tiporeciboCambio.next(lista);
  }

  getTipoReciboCambio(){
    return this.tiporeciboCambio.asObservable();
  }


}
