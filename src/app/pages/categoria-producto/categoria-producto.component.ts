
import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoriaInsumoService } from './../../_service/categoria-insumo.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { CategoriaInsumo } from './../../_model/categoria-insumo';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CategoriaProductoEdicionComponent } from './categoria-producto-edicion/categoria-producto-edicion.component';
import { CategoriaProducto } from 'src/app/_model/categoria-producto';
import { CategoriaProductoService } from 'src/app/_service/categoria-producto.service';

@Component({
  selector: 'app-categoria-producto',
  templateUrl: './categoria-producto.component.html',
  styleUrls: ['./categoria-producto.component.css'],

})
export class CategoriaProductoComponent implements OnInit {
displayedColumns = ['nombre', 'descripcion', 'activo', 'acciones'];
dataSource: MatTableDataSource<CategoriaProducto>;
@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;
cantidad: number = 0;
nombre: string
descripcion: string
activo: boolean

constructor(
  private categoriaProductoService: CategoriaProductoService,
  private snackBar: MatSnackBar,
  public dialog: MatDialog
) { }

ngOnInit(): void {
  this.categoriaProductoService.getCategoriaProductoCambio().subscribe(data => {

    this.crearTabla(data);
  });

  this.categoriaProductoService.getMensajeCambio().subscribe(data => {

    this.snackBar.open(data, 'AVISO', { duration: 2000 });
  });

  this.categoriaProductoService.listarPageable(0, 5).subscribe(data => {

    this.cantidad = data.totalElements;
    this.dataSource = new MatTableDataSource(data.content);
    this.dataSource.sort = this.sort;
  });


}

filtrar(valor: string) {
  this.dataSource.filter = valor.trim().toLowerCase();
}

crearTabla(data: CategoriaProducto[]) {
  this.dataSource = new MatTableDataSource(data);
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
}

eliminar(id: number) {
  this.categoriaProductoService.eliminar(id).pipe(switchMap(() => {
    return this.categoriaProductoService.listar();
  })).subscribe(data => {
    this.categoriaProductoService.setCategoriaProductoCambio(data);
    this.categoriaProductoService.setMensajeCambio('SE ELIMINO');
  });
}

mostrarMas(e: any){
  this.categoriaProductoService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
    this.cantidad = data.totalElements;
    this.dataSource = new MatTableDataSource(data.content);
    this.dataSource.sort = this.sort;
  });
}
openDialog(): void {

  const dialogRef = this.dialog.open(CategoriaProductoEdicionComponent, {
    width: '500px',
    // height: '600px',
    maxHeight: '600px',
    data: {
            nombre: this.nombre,
            descripcion: this.descripcion,
            activo: this.activo
          }
  });


  dialogRef.afterClosed().subscribe(result => {
    console.log(`The dialog was closed  ${result}`);
  });
}

openDialogMod(element: any): void {

  const dialogRef = this.dialog.open(CategoriaProductoEdicionComponent, {
    width: '500px',
    maxHeight: '600px',
    data: {idCategoriaProducto: element.idCategoriaProducto,
          nombre: element.nombre,
          descripcion: element.descripcion,
          activo: element.activo
          }
  });


  dialogRef.afterClosed().subscribe(result => {
    console.log(`The dialog was closed  ${result}`);

  });

}


}



