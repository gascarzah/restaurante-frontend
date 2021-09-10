import { ConfirmDialogComponent } from './../util/confirm-dialog/confirm-dialog.component';
import { switchMap } from 'rxjs/operators';
import { ProductoEdicionComponent } from './producto-edicion/producto-edicion.component';
import { Producto } from './../../_model/producto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductoService } from './../../_service/producto.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CategoriaProducto } from 'src/app/_model/categoria-producto';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  displayedColumns = [ 'nombre','descripcion', 'categoria', 'precio', 'stock',  'acciones'];

  dataSource: MatTableDataSource<Producto>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  cantidad: number = 0;
//para los dialogos de mantenimiento

nombre: string = '';
descripcion: string= '';
precio: string= '';
categoriaProducto: CategoriaProducto = new CategoriaProducto();
stock: number = 0;

activo: boolean = true;


  constructor(
    private productoService: ProductoService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.productoService.getProductoCambio().subscribe(data => {

      this.crearTabla(data);
    });

    this.productoService.getMensajeCambio().subscribe(data => {

      this.snackBar.open(data, 'AVISO', { duration: 2000 });
    });

    this.productoService.listarPageable(0, 5).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });


  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  crearTabla(data: Producto[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  eliminar(id: number) {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmacion de eliminacion',
        message: 'Estas seguro de eliminar este elemento? '
      }
    });

    confirmDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.productoService.eliminar(id).pipe(switchMap(() => {
      return this.productoService.listar();
    })).subscribe(data => {
      this.productoService.setProductoCambio(data);
      this.productoService.setMensajeCambio('SE ELIMINO');
    });
      }
    });

  }

  mostrarMas(e: any){

    this.productoService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });
  }


  openDialog(): void {

    const dialogRef = this.dialog.open(ProductoEdicionComponent, {
      width: '500px',
      // height: '600px',
      maxHeight: '600px',
      data: {
            nombre: this.nombre,
            descripcion: this.descripcion,
            precio: this.precio,
            categoriaProducto: this.categoriaProducto,
            stock: this.stock

             }

    });


    dialogRef.afterClosed().subscribe(result => {
      console.log(`The dialog was closed  ${result}`);
    });
  }

  openDialogMod(element: any): void {

    const dialogRef = this.dialog.open(ProductoEdicionComponent, {
      width: '500px',
      maxHeight: '600px',
      data: {idProducto: element.idProducto,
        nombre: element.nombre,
        descripcion: element.descripcion,
        precio: element.precio,
        categoriaProducto: element.categoriaProducto,
        stock: element.stock}
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log(`The dialog was closed  ${result}`);

    });

  }




}


