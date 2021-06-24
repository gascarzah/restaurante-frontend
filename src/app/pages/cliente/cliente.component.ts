import { ConfirmDialogComponent } from './../util/confirm-dialog/confirm-dialog.component';
import { ClienteEdicionComponent } from './cliente-edicion/cliente-edicion.component';
import { MantenimientoComponent } from './mantenimiento/mantenimiento.component';
import { ClienteService } from './../../_service/cliente.service';
import { Cliente } from './../../_model/cliente';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { switchMap } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  displayedColumns = [ 'dni', 'apellidoPaterno', 'apellidoMaterno','nombres', 'telefono', 'email', 'direccion', 'activo',  'acciones'];

  dataSource: MatTableDataSource<Cliente>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  cantidad: number = 0;
//para los dialogos de mantenimiento
  dni: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  email: string;
  direccion: string;
  activo: boolean = true;
  imagen: string;
  constructor(
    private clienteService: ClienteService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.clienteService.getClienteCambio().subscribe(data => {

      this.crearTabla(data);
    });

    this.clienteService.getMensajeCambio().subscribe(data => {

      this.snackBar.open(data, 'AVISO', { duration: 2000 });
    });

    this.clienteService.listarPageable(0, 5).subscribe(data => {

      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });


  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  crearTabla(data: Cliente[]) {
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
        this.clienteService.eliminar(id).pipe(switchMap(() => {
      return this.clienteService.listar();
    })).subscribe(data => {
      this.clienteService.setClienteCambio(data);
      this.clienteService.setMensajeCambio('SE ELIMINO');
    });
      }
    });

  }

  mostrarMas(e: any){

    this.clienteService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });
  }


  openDialog(): void {

    const dialogRef = this.dialog.open(ClienteEdicionComponent, {
      width: '500px',
      // height: '600px',
      maxHeight: '600px',
      data: {nombres: this.nombres,
             apellidoPaterno: this.apellidoPaterno,
             apellidoMaterno: this.apellidoMaterno,
             telefono: this.telefono,
             email: this.email,
             direccion: this.direccion,
             activo: this.activo,
             imagen: this.imagen}
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log(`The dialog was closed  ${result}`);
    });
  }

  openDialogMod(element: any): void {

    const dialogRef = this.dialog.open(ClienteEdicionComponent, {
      width: '500px',
      maxHeight: '600px',
      data: {idCliente: element.idCliente,
             dni: element.dni,
             nombres: element.nombres,
             apellidoPaterno: element.apellidoPaterno,
             apellidoMaterno: element.apellidoMaterno,
             telefono: element.telefono,
             email: element.email,
             direccion: element.direccion,
             activo: element.activo,
             imagen: element.imagen}
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log(`The dialog was closed  ${result}`);

    });

  }


}


