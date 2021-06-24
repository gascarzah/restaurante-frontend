import { switchMap } from 'rxjs/operators';
import { MesaService } from './../../../_service/mesa.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Mesa } from './../../../_model/mesa';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-mesa-edicion',
  templateUrl: './mesa-edicion.component.html',
  styleUrls: ['./mesa-edicion.component.css']
})
export class MesaEdicionComponent implements OnInit {
  habilitado: boolean = true
  flag : boolean = false
  mensaje: string;
  // maxFecha: Date = new Date();
  // nombreArchivo: string;
  // archivosSeleccionados: FileList;

  constructor(
    public dialogRef: MatDialogRef<MesaEdicionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Mesa,
    protected mesaService: MesaService,
    private snackBar: MatSnackBar) {

      if(this.data.idMesa == null){
        this.habilitado = false
      }else{
        this.habilitado = true
      }
    }

  registrar(): void {

    if(this.validacion(this.data)){
      if(this.data.idMesa == undefined){
        this.mesaService.registrar(this.data).pipe(switchMap(() => {
        return this.mesaService.listar();
      })).subscribe(data => {
        this.mesaService.mesaCambio.next(data);
        this.mesaService.mensajeCambio.next('SE REGISTRO');
      });
      }else{
        this.mesaService.modificar(this.data).subscribe(() => {
          this.mesaService.listar().subscribe(data => {
            this.mesaService.setMesaCambio(data);
            this.mesaService.setMensajeCambio('SE MODIFICÓ');
          });
        });
      }
      this.dialogRef.close();
    }
  }

  validacion(data: Mesa){

    if(!data.codigo){
      this.mensaje = `Debe agregar codigo de mesa`;
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

