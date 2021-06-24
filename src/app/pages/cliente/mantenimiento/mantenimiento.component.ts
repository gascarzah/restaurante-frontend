import { FileService } from './../../../_service/file.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs/operators';
import { ClienteService } from './../../../_service/cliente.service';
import { Cliente } from './../../../_model/cliente';
import { Component, OnInit, Inject, ComponentFactoryResolver } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MyErrorStateMatcher } from 'src/app/util/MyErrorStateMatcher ';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.css']
})
export class MantenimientoComponent implements OnInit {
  habilitado: boolean = true
  flag : boolean = false
  mensaje: string;
  matcher = new MyErrorStateMatcher();
  nombreArchivo: string;
  archivosSeleccionados: FileList;

  constructor(
    public dialogRef: MatDialogRef<MantenimientoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Cliente,
    protected clienteService: ClienteService,
    private snackBar: MatSnackBar,
    private fileService :FileService) {

      if(this.data.idCliente == null){
        this.habilitado = false
      }else{
        this.habilitado = true
      }
    }

  registrar(): void {

    if(this.validacion(this.data)){
      if(this.data.idCliente == undefined){
        this.clienteService.registrar(this.data).pipe(switchMap(() => {
        return this.clienteService.listar();
      })).subscribe(data => {
        this.clienteService.clienteCambio.next(data);
        this.clienteService.mensajeCambio.next('SE REGISTRO');
      });
      }else{
        this.clienteService.modificar(this.data).subscribe(() => {
          this.clienteService.listar().subscribe(data => {
            this.clienteService.setClienteCambio(data);
            this.clienteService.setMensajeCambio('SE MODIFICÓ');
          });
        });
      }
      this.dialogRef.close();
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
  if (/[a-zA-Z0-9-_ ]/.test(inp)) {
    return true;
  } else {
    event.preventDefault();
    return false;
  }
}
// seleccionarArchivo(e: any) {
//   console.log(e.target.files);
//   this.nombreArchivo = e.target.files[0].name;
//   this.archivosSeleccionados = e.target.files;
//   this.data.imagen = this.nombreArchivo

//   this.fileService.uploadFile(e.target.files[0]).subscribe(response => {

//      if (response instanceof HttpResponse) {
// 		 //this.msg = response.body;
//         console.log(response.body);
//       }
//     });

// }

}

