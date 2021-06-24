import { Insumo } from 'src/app/_model/insumo';
import { MedidaService } from './../../../_service/medida.service';
import { UnidadService } from './../../../_service/unidad.service';
import { CategoriaInsumoService } from './../../../_service/categoria-insumo.service';
import { Unidad } from './../../../_model/unidad';
import { Medida } from './../../../_model/medida';
import { CategoriaInsumo } from './../../../_model/categoria-insumo';
import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InsumoService } from './../../../_service/insumo.service';

import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-insumo-edicion',
  templateUrl: './insumo-edicion.component.html',
  styleUrls: ['./insumo-edicion.component.css']
})
export class InsumoEdicionComponent implements OnInit {
  habilitado: boolean = true
  flag : boolean = false
  mensaje: string;
  maxFecha: Date = new Date();
  nombreArchivo: string;
  archivosSeleccionados: FileList;
  categoriaInsumos$: Observable<CategoriaInsumo[]>;
  medidas$: Observable<Medida[]>;
  unidades$: Observable<Unidad[]>;
  insumo: Insumo
  categoriaInsumo: CategoriaInsumo
  medida: Medida
  unidad: Unidad
  constructor(
    public dialogRef: MatDialogRef<InsumoEdicionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Insumo,
    protected insumoService: InsumoService,
    private snackBar: MatSnackBar,
    private unidadService: UnidadService,
    private medidaService: MedidaService,
    private categoriaInsumoService: CategoriaInsumoService) {

      if(this.data.idInsumo == null){
        this.habilitado = false
      }else{
        this.habilitado = true
      }
    }

  registrar(): void {
    console.log(this.data)
    if(this.validacion(this.data)){
      if(this.data.idInsumo == undefined){
        this.insumoService.registrar(this.data).pipe(switchMap(() => {
        return this.insumoService.listar();
      })).subscribe(data => {
        this.insumoService.insumoCambio.next(data);
        this.insumoService.mensajeCambio.next('SE REGISTRÓ');
      });
      }else{

        this.insumoService.modificar(this.data).pipe(switchMap(() => {
          return this.insumoService.listar()
        })).subscribe(data => {
          this.insumoService.setInsumoCambio(data)
          this.insumoService.setMensajeCambio('SE MODIFICÓ')
        })
      }
      this.dialogRef.close();
    }
  }

  validacion(data: Insumo){

    if(!data.descripcion){
      this.mensaje = `Debe agregar una descripcion`;
      this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
      return false
    }
    // else if(!data.apellidoPaterno){
    //   this.mensaje = `Ingresar el apellido paterno`;
    //   this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
    //   return false
    // }else if(!data.apellidoMaterno){
    //   this.mensaje = `Ingresar el apellido materno`;
    //   this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
    //   return false
    // }

    return true

  }

  ngOnInit(): void {
    this.listarCategoriaInsumos()
    this.listarMedidas()
    this.listarUnidades()
  }

  keyPressAlpha(event: any) {

    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z ]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

// Only Integer Numbers
keyPressNumbers(event: any) {
  var charCode = (event.which) ? event.which : event.keyCode;
  // Only Numbers 0-9
  if ((charCode < 48 || charCode > 57) ) {
    event.preventDefault();
    return false;
  } else {
    return true;
  }
}

validaDecimal(event: any) {

  var inp = String.fromCharCode(event.keyCode);
  // Allow numbers, alpahbets, space, underscore
  if (/[0-9.]/.test(inp)) {
    return true;
  } else {
    event.preventDefault();
    return false;
  }
}

// Only AlphaNumeric with Some Characters [-_ ]
keyPressAlphaNumericWithCharacters(event: any) {

  var inp = String.fromCharCode(event.keyCode);
  // Allow numbers, alpahbets, space, underscore
  if (/[a-zA-Z0-9-_. ]/.test(inp)) {
    return true;
  } else {
    event.preventDefault();
    return false;
  }
}
listarCategoriaInsumos() {
  this.categoriaInsumos$ = this.categoriaInsumoService.listar();

}

listarMedidas() {
  this.medidas$ = this.medidaService.listar();

}

listarUnidades() {
  this.unidades$ = this.unidadService.listar();

}

public objectCompararUnidadFunction = function( option: any, value: any ) : boolean {

    return  undefined !== value  && (option.idUnidad === value.idUnidad) ;

}

public objectCompararCategoriaInsumoFunction = function( option: any, value: any ) : boolean {

  return undefined !== value  && (option.idCategoriaInsumo === value.idCategoriaInsumo);
}

public objectCompararMedidaFunction = function( option: any, value: any ) : boolean {


    return undefined !== value  && (option.idMedida === value.idMedida);

}

}

