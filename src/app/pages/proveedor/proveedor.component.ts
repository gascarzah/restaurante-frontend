import { ProveedorEdicionComponent } from './proveedor-edicion/proveedor-edicion.component';
import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProveedorService } from './../../_service/proveedor.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Proveedor } from './../../_model/proveedor';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit {
  displayedColumns = [  'ruc', 'razonSocial', 'direccion','telefono',  'email', 'cuenta01', 'cuenta02',  'acciones' ];

  dataSource: MatTableDataSource<Proveedor>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  cantidad: number = 0;
  // dni: string;
  razonSocial: string;
  cuenta01: string;
  cuenta02: string;
  telefono: string;
  email: string;
  direccion: string;
  ruc: string;
  // activo: boolean = true;

  constructor(
    private proveedorService: ProveedorService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.proveedorService.getProveedorCambio().subscribe(data => {

      this.crearTabla(data);
    });

    this.proveedorService.getMensajeCambio().subscribe(data => {

      this.snackBar.open(data, 'AVISO', { duration: 2000 });
    });

    this.proveedorService.listarPageable(0, 10).subscribe(data => {

      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });


  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  crearTabla(data: Proveedor[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  eliminar(id: number) {
    this.proveedorService.eliminar(id).pipe(switchMap(() => {
      return this.proveedorService.listar();
    })).subscribe(data => {
      this.proveedorService.setProveedorCambio(data);
      this.proveedorService.setMensajeCambio('SE ELIMINO');
    });
  }

  mostrarMas(e: any){
    this.proveedorService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });
  }

  openDialog(): void {

    const dialogRef = this.dialog.open(ProveedorEdicionComponent, {
      width: '500px',
      // height: '600px',
      maxHeight: '600px',
      data: { //dni: this.dni,
              ruc: this.ruc,
              razonSocial: this.razonSocial,
              cuenta01: this.cuenta01,
              cuenta02: this.cuenta02,
              telefono: this.telefono,
              email: this.email,
              direccion: this.direccion,
              //activo: this.activo
            }
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log(`The dialog was closed  ${result}`);
    });
  }

  openDialogMod(element: any): void {

    const dialogRef = this.dialog.open(ProveedorEdicionComponent, {
      width: '500px',
      maxHeight: '600px',
      data: {idProveedor: element.idProveedor,
             //dni: element.dni,
             ruc: element.ruc,
             razonSocial: element.razonSocial,
             cuenta01: element.cuenta01,
             cuenta02: element.cuenta02,
             telefono: element.telefono,
             email: element.email,
             direccion: element.direccion,
            // activo: element.activo
            }
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log(`The dialog was closed  ${result}`);

    });

  }


}



