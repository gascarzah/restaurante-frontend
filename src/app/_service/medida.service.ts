import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Subject } from 'rxjs';
import { Medida } from './../_model/medida';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MedidaService extends GenericService<Medida>{

  private medidaCambio = new Subject<Medida[]>();
  private mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/medidas`);
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

  setMedidaCambio(lista: Medida[]){
    this.medidaCambio.next(lista);
  }

  getMedidaCambio(){
    return this.medidaCambio.asObservable();
  }


}
