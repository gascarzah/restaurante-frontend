
import { Unidad } from './../../_model/unidad';
import { Medida } from './../../_model/medida';
import { CategoriaInsumo } from './../../_model/categoria-insumo';
import { InsumoEdicionComponent } from './insumo-edicion/insumo-edicion.component';
import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InsumoService } from './../../_service/insumo.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { Insumo } from 'src/app/_model/insumo';



@Component({
  selector: 'app-insumo',
  templateUrl: './insumo.component.html',
  styleUrls: ['./insumo.component.css']
})
export class InsumoComponent implements OnInit {
  displayedColumns = [  'descripcion','cantidadPorMedida', 'precioSugerido', 'stockMinimo', 'categoriaInsumo', 'medida', 'unidad','acciones'];
  dataSource: MatTableDataSource<Insumo>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  cantidad: number = 0;

  idInsumo: number
  descripcion: string
  cantidadPorMedida: number
  precioSugerido: number
  stockMinimo: number
  categoriaInsumo: CategoriaInsumo
  medida: Medida
  unidad: Unidad
  constructor(
    private insumoService: InsumoService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.insumoService.getInsumoCambio().subscribe(data => {

      this.crearTabla(data);
    });

    this.insumoService.getMensajeCambio().subscribe(data => {

      this.snackBar.open(data, 'AVISO', { duration: 2000 });
    });

    this.insumoService.listarPageable(0, 5).subscribe(data => {

      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });


  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  crearTabla(data: Insumo[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  eliminar(id: number) {
    this.insumoService.eliminar(id).pipe(switchMap(() => {
      return this.insumoService.listar();
    })).subscribe(data => {
      this.insumoService.setInsumoCambio(data);
      this.insumoService.setMensajeCambio('SE ELIMINO');
    });
  }

  mostrarMas(e: any){
    this.insumoService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });
  }

  openDialog(): void {

    const dialogRef = this.dialog.open(InsumoEdicionComponent, {
      width: '300px',
      // height: '600px',
      maxHeight: '600px',
      data: {descripcion: this.descripcion,
        cantidadPorMedida: this.cantidadPorMedida,
        precioSugerido: this.precioSugerido,
        stockMinimo: this.stockMinimo,
        categoriaInsumo: this.categoriaInsumo,
        medida: this.medida,
        unidad: this.unidad}
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log(`The dialog was closed  ${result}`);
    });
  }

  openDialogMod(element: any): void {

    const dialogRef = this.dialog.open(InsumoEdicionComponent, {
      width: '300px',
      maxHeight: '600px',
      data: {idInsumo: element.idInsumo,
        descripcion: element.descripcion,
        cantidadPorMedida: element.cantidadPorMedida,
        precioSugerido: element.precioSugerido,
        stockMinimo: element.stockMinimo,
        categoriaInsumo: element.categoriaInsumo,
        medida: element.medida,
        unidad: element.unidad,
            //  activo: element.activo,
            //  imagen: element.imagen
            }
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log(`The dialog was closed  ${result}`);

    });

  }




  }
