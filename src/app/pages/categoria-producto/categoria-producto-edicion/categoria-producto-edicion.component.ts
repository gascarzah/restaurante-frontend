import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoriaProductoService } from 'src/app/_service/categoria-producto.service';
import { CategoriaProducto } from 'src/app/_model/categoria-producto';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-categoria-producto-edicion',
  templateUrl: './categoria-producto-edicion.component.html',
  styleUrls: ['./categoria-producto-edicion.component.css']
})
export class CategoriaProductoEdicionComponent implements OnInit {
  habilitado: boolean = true
  flag : boolean = false
  mensaje: string;
  maxFecha: Date = new Date();
  nombreArchivo: string;
  archivosSeleccionados: FileList;

  constructor(
    public dialogRef: MatDialogRef<CategoriaProductoEdicionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CategoriaProducto,
    protected categoriaProductoService: CategoriaProductoService,
    private snackBar: MatSnackBar) {

      if(this.data.idCategoriaProducto == null){
        this.habilitado = false
      }else{
        this.habilitado = true
      }
    }

  registrar(): void {

    if(this.validacion(this.data)){
      if(this.data.idCategoriaProducto == undefined){
        this.categoriaProductoService.registrar(this.data).pipe(switchMap(() => {
        return this.categoriaProductoService.listar();
      })).subscribe(data => {
        this.categoriaProductoService.categoriaProductoCambio.next(data);
        this.categoriaProductoService.mensajeCambio.next('SE REGISTRO');
      });
      }else{
        this.categoriaProductoService.modificar(this.data).subscribe(() => {
          this.categoriaProductoService.listar().subscribe(data => {
            this.categoriaProductoService.setCategoriaProductoCambio(data);
            this.categoriaProductoService.setMensajeCambio('SE MODIFICÓ');
          });
        });
      }
      this.dialogRef.close();
    }
  }

  validacion(data: CategoriaProducto){

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

