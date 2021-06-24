import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmpleadoService } from './../../../_service/empleado.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Empleado } from './../../../_model/empleado';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-empleado-edicion',
  templateUrl: './empleado-edicion.component.html',
  styleUrls: ['./empleado-edicion.component.css']
})
export class EmpleadoEdicionComponent implements OnInit {
  habilitado: boolean = true
  flag : boolean = false
  mensaje: string;
  maxFecha: Date = new Date();
  nombreArchivo: string;
  archivosSeleccionados: FileList;

  constructor(
    public dialogRef: MatDialogRef<EmpleadoEdicionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Empleado,
    protected empleadoService: EmpleadoService,
    private snackBar: MatSnackBar) {

      if(this.data.idEmpleado == null){
        this.habilitado = false
      }else{
        this.habilitado = true
      }
    }

  registrar(): void {

    if(this.validacion(this.data)){
      if(this.data.idEmpleado == undefined){
        this.empleadoService.registrar(this.data).pipe(switchMap(() => {
        return this.empleadoService.listar();
      })).subscribe(data => {
        this.empleadoService.empleadoCambio.next(data);
        this.empleadoService.mensajeCambio.next('SE REGISTRO');
      });
      }else{
        this.empleadoService.modificar(this.data).subscribe(() => {
          this.empleadoService.listar().subscribe(data => {
            this.empleadoService.setEmpleadoCambio(data);
            this.empleadoService.setMensajeCambio('SE MODIFICÓ');
          });
        });
      }
      this.dialogRef.close();
    }
  }

  validacion(data: Empleado){

    if(!data.dni){
      this.mensaje = `Debe agregar un dni`;
      this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
      return false
    }else if(!data.apellidoPaterno){
      this.mensaje = `Ingresar el apellido paterno`;
      this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
      return false
    }else if(!data.apellidoMaterno){
      this.mensaje = `Ingresar el apellido materno`;
      this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
      return false
    }

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

