import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProveedorService } from './../../../_service/proveedor.service';
import { Proveedor } from './../../../_model/proveedor';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-proveedor-edicion',
  templateUrl: './proveedor-edicion.component.html',
  styleUrls: ['./proveedor-edicion.component.css']
})
export class ProveedorEdicionComponent implements OnInit {
  habilitado: boolean = true
  flag : boolean = false
  mensaje: string;
  maxFecha: Date = new Date();
  nombreArchivo: string;
  archivosSeleccionados: FileList;

  constructor(
    public dialogRef: MatDialogRef<ProveedorEdicionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Proveedor,
    protected proveedorService: ProveedorService,
    private snackBar: MatSnackBar) {

      if(this.data.idProveedor == null){
        this.habilitado = false
      }else{
        this.habilitado = true
      }
    }

  registrar(): void {

    if(this.validacion(this.data)){
      if(this.data.idProveedor == undefined){
        this.proveedorService.registrar(this.data).pipe(switchMap(() => {
        return this.proveedorService.listar();
      })).subscribe(data => {
        this.proveedorService.proveedorCambio.next(data);
        this.proveedorService.mensajeCambio.next('SE REGISTRO');
      });
      }else{
        this.proveedorService.modificar(this.data).subscribe(() => {
          this.proveedorService.listar().subscribe(data => {
            this.proveedorService.setProveedorCambio(data);
            this.proveedorService.setMensajeCambio('SE MODIFICÓ');
          });
        });
      }
      this.dialogRef.close();
    }
  }

  validacion(data: Proveedor){

    if(!data.ruc){
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

