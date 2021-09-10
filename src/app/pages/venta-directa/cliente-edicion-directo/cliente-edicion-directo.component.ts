import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClienteService } from './../../../_service/cliente.service';
import { MyErrorStateMatcher } from 'src/app/util/MyErrorStateMatcher ';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cliente } from 'src/app/_model/cliente';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-cliente-edicion-directo',
  templateUrl: './cliente-edicion-directo.component.html',
  styleUrls: ['./cliente-edicion-directo.component.css']
})
export class ClienteEdicionDirectoComponent implements OnInit {
  habilitado: boolean = true
  flag : boolean = false
  mensaje: string;
  matcher = new MyErrorStateMatcher();
  nombreArchivo: string;
  archivosSeleccionados: FileList;

  constructor(
    public dialogRef: MatDialogRef<ClienteEdicionDirectoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Cliente,
    protected clienteService: ClienteService,
    private snackBar: MatSnackBar) {

      if(this.data.idCliente == null){
        this.habilitado = false
      }else{
        this.habilitado = true
      }
    }

  registrar(): void {

    if(this.validacion(this.data)){
      if(this.data.idCliente == undefined){
        this.clienteService.registrar(this.data).subscribe(data => {
          console.log(data)
        // this.clienteService.clienteCambio.next(data);

        this.clienteService.mensajeCambio.next('SE REGISTRO');
        this.dialogRef.close(data);
      });
      }else{
        this.clienteService.modificar(this.data).subscribe(() => {
          this.clienteService.listar().subscribe(data => {
            this.clienteService.setClienteCambio(data);
            this.clienteService.setMensajeCambio('SE MODIFICÓ');
          });
        });
        this.dialogRef.close();
      }

    }
  }

  validacion(data: Cliente){

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

