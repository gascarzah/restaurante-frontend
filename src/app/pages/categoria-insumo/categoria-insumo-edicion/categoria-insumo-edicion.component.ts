import { switchMap } from 'rxjs/operators';
import { CategoriaInsumo } from './../../../_model/categoria-insumo';
import { CategoriaInsumoService } from './../../../_service/categoria-insumo.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-categoria-insumo-edicion',
  templateUrl: './categoria-insumo-edicion.component.html',
  styleUrls: ['./categoria-insumo-edicion.component.css']
})
export class CategoriaInsumoEdicionComponent implements OnInit {
  habilitado: boolean = true
  flag : boolean = false
  mensaje: string;
  maxFecha: Date = new Date();
  nombreArchivo: string;
  archivosSeleccionados: FileList;

  constructor(
    public dialogRef: MatDialogRef<CategoriaInsumoEdicionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CategoriaInsumo,
    protected categoriaInsumoService: CategoriaInsumoService,
    private snackBar: MatSnackBar) {

      if(this.data.idCategoriaInsumo == null){
        this.habilitado = false
      }else{
        this.habilitado = true
      }
    }

  registrar(): void {

    if(this.validacion(this.data)){
      if(this.data.idCategoriaInsumo == undefined){
        this.categoriaInsumoService.registrar(this.data).pipe(switchMap(() => {
        return this.categoriaInsumoService.listar();
      })).subscribe(data => {
        this.categoriaInsumoService.categoriaInsumoCambio.next(data);
        this.categoriaInsumoService.mensajeCambio.next('SE REGISTRO');
      });
      }else{
        this.categoriaInsumoService.modificar(this.data).subscribe(() => {
          this.categoriaInsumoService.listar().subscribe(data => {
            this.categoriaInsumoService.setCategoriaInsumoCambio(data);
            this.categoriaInsumoService.setMensajeCambio('SE MODIFICÓ');
          });
        });
      }
      this.dialogRef.close();
    }
  }

  validacion(data: CategoriaInsumo){

    if(!data.nombre){
      this.mensaje = `Debe agregar un ruc`;
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
  if ((charCode < 48 || charCode > 57)) {
    event.preventDefault();
    return false;
  } else {
    return true;
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


}

