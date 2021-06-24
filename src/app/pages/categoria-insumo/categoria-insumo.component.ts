
import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoriaInsumoService } from './../../_service/categoria-insumo.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CategoriaInsumo } from './../../_model/categoria-insumo';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CategoriaInsumoEdicionComponent } from './categoria-insumo-edicion/categoria-insumo-edicion.component';

@Component({
  selector: 'app-categoria-insumo',
  templateUrl: './categoria-insumo.component.html',
  styleUrls: ['./categoria-insumo.component.css']
})
export class CategoriaInsumoComponent implements OnInit {
  displayedColumns = ['nombre', 'descripcion', 'activo', 'acciones'];
  dataSource: MatTableDataSource<CategoriaInsumo>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  cantidad: number = 0;
  nombre: string
  descripcion: string
  activo: boolean
  constructor(
    private categoriaInsumoService: CategoriaInsumoService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.categoriaInsumoService.getCategoriaInsumoCambio().subscribe(data => {

      this.crearTabla(data);
    });

    this.categoriaInsumoService.getMensajeCambio().subscribe(data => {

      this.snackBar.open(data, 'AVISO', { duration: 2000 });
    });

    this.categoriaInsumoService.listarPageable(0, 5).subscribe(data => {

      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });


  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  crearTabla(data: CategoriaInsumo[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  eliminar(id: number) {
    this.categoriaInsumoService.eliminar(id).pipe(switchMap(() => {
      return this.categoriaInsumoService.listar();
    })).subscribe(data => {
      this.categoriaInsumoService.setCategoriaInsumoCambio(data);
      this.categoriaInsumoService.setMensajeCambio('SE ELIMINO');
    });
  }

  mostrarMas(e: any){
    this.categoriaInsumoService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });
  }
  openDialog(): void {

    const dialogRef = this.dialog.open(CategoriaInsumoEdicionComponent, {
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

    const dialogRef = this.dialog.open(CategoriaInsumoEdicionComponent, {
      width: '500px',
      maxHeight: '600px',
      data: {idCategoriaInsumo: element.idCategoriaInsumo,
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



