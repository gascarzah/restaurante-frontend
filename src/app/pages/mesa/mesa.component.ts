import { MesaEdicionComponent } from './mesa-edicion/mesa-edicion.component';
import { MesaService } from './../../_service/mesa.service';
import { Mesa } from './../../_model/mesa';

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-mesa',
  templateUrl: './mesa.component.html',
  styleUrls: ['./mesa.component.css']
})
export class MesaComponent implements OnInit {
  displayedColumns = [ 'codigo', 'activo', 'acciones'];
 activo: boolean
 codigo: string
  dataSource: MatTableDataSource<Mesa>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  cantidad: number = 0;

  constructor(
    private mesaService: MesaService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.mesaService.getMesaCambio().subscribe(data => {

      this.crearTabla(data);
    });

    this.mesaService.getMensajeCambio().subscribe(data => {

      this.snackBar.open(data, 'AVISO', { duration: 2000 });
    });

    this.mesaService.listarPageable(0, 10).subscribe(data => {

      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });


  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  crearTabla(data: Mesa[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  eliminar(id: number) {
    this.mesaService.eliminar(id).pipe(switchMap(() => {
      return this.mesaService.listar();
    })).subscribe(data => {
      this.mesaService.setMesaCambio(data);
      this.mesaService.setMensajeCambio('SE ELIMINO');
    });
  }

  mostrarMas(e: any){
    this.mesaService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });
  }

  openDialog(): void {

    const dialogRef = this.dialog.open(MesaEdicionComponent, {
      width: '500px',
      // height: '600px',
      maxHeight: '600px',
      data: {
             codigo: this.codigo,
             activo: this.activo
            }
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log(`The dialog was closed  ${result}`);
    });
  }

  openDialogMod(element: any): void {

    const dialogRef = this.dialog.open(MesaEdicionComponent, {
      width: '500px',
      maxHeight: '600px',
      data: {idMesa: element.idMesa,
              codigo: element.codigo,
              activo: element.activo
            }
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log(`The dialog was closed  ${result}`);

    });

  }


}

