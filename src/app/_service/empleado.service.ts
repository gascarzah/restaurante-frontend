
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Subject } from 'rxjs';
import { Empleado } from './../_model/empleado';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService extends GenericService<Empleado>{

  empleadoCambio = new Subject<Empleado[]>();
  mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/empleados`);
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

  setEmpleadoCambio(lista: Empleado[]){
    this.empleadoCambio.next(lista);
  }

  getEmpleadoCambio(){
    return this.empleadoCambio.asObservable();
  }


}
