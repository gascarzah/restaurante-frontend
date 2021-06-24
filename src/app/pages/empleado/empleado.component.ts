import { EmpleadoEdicionComponent } from './empleado-edicion/empleado-edicion.component';
import { ConfirmDialogComponent } from './../util/confirm-dialog/confirm-dialog.component';
import { switchMap } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Empleado } from './../../_model/empleado';
import { EmpleadoService } from './../../_service/empleado.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css']
})
export class EmpleadoComponent implements OnInit {

  displayedColumns = [ 'dni', 'apellidoPaterno', 'apellidoMaterno','nombres', 'telefono', 'email', 'direccion', 'activo',  'acciones'];

  dataSource: MatTableDataSource<Empleado>;
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
fechaIngreso: string

  constructor(
    private empleadoService: EmpleadoService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.empleadoService.getEmpleadoCambio().subscribe(data => {

      this.crearTabla(data);
    });

    this.empleadoService.getMensajeCambio().subscribe(data => {

      this.snackBar.open(data, 'AVISO', { duration: 2000 });
    });

    this.empleadoService.listarPageable(0, 5).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });


  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  crearTabla(data: Empleado[]) {
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
        this.empleadoService.eliminar(id).pipe(switchMap(() => {
      return this.empleadoService.listar();
    })).subscribe(data => {
      this.empleadoService.setEmpleadoCambio(data);
      this.empleadoService.setMensajeCambio('SE ELIMINO');
    });
      }
    });

  }

  mostrarMas(e: any){

    this.empleadoService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });
  }


  openDialog(): void {

    const dialogRef = this.dialog.open(EmpleadoEdicionComponent, {
      width: '500px',
      // height: '600px',
      maxHeight: '600px',
      data: {dni: this.dni,
             nombres: this.nombres,
             apellidoPaterno: this.apellidoPaterno,
             apellidoMaterno: this.apellidoMaterno,
             telefono: this.telefono,
             email: this.email,
             fechaIngreso: this.fechaIngreso,
             direccion: this.direccion,
             activo: this.activo}
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log(`The dialog was closed  ${result}`);
    });
  }

  openDialogMod(element: any): void {

    const dialogRef = this.dialog.open(EmpleadoEdicionComponent, {
      width: '500px',
      maxHeight: '600px',
      data: {idEmpleado: element.idEmpleado,
             dni: element.dni,
             nombres: element.nombres,
             apellidoPaterno: element.apellidoPaterno,
             apellidoMaterno: element.apellidoMaterno,
             telefono: element.telefono,
             email: element.email,
             fechaIngreso: element.fechaIngreso,
             direccion: element.direccion,
             activo: element.activo}
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log(`The dialog was closed  ${result}`);

    });

  }


}


