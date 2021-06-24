import { ProductoDetalleService } from './../../../_service/producto-detalle.service';
import { ProductoDto } from './../../../_dto/productoDto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Insumo } from 'src/app/_model/insumo';
import { InsumoService } from './../../../_service/insumo.service';
import { UnidadService } from './../../../_service/unidad.service';
import { Unidad } from './../../../_model/unidad';
import { MatTableDataSource } from '@angular/material/table';
import { ProductoDetalle } from './../../../_model/producto-detalle';



import { CategoriaProductoService } from '../../../_service/categoria-producto.service';
import { CategoriaProducto } from '../../../_model/categoria-producto';
import { switchMap } from 'rxjs/operators';
import { Producto } from '../../../_model/producto';
import { ProductoService } from '../../../_service/producto.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Destino } from 'src/app/_model/destino';

@Component({
  selector: 'app-producto-edicion',
  templateUrl: './producto-edicion.component.html',
  styleUrls: ['./producto-edicion.component.css']
})
export class ProductoEdicionComponent implements OnInit {

 form: FormGroup

 edicion: boolean = false;
 producto: Producto
 idProducto: number;
 categoriaProductos$: Observable<CategoriaProducto[]>;
 categoriaProducto: CategoriaProducto;
 productoDetalleArr: ProductoDetalle[] = [];
 dataSourceProductoDetalle: MatTableDataSource<ProductoDetalle>;
 cantidad: number;
 insumos$: Observable<Insumo[]>;
 insumo: Insumo
 unidades$: Observable<Unidad[]>;
 unidad: Unidad

 displayedColumns = [ 'insumo', 'cantidad','unidad'];
 columnsToDisplay: string[] = this.displayedColumns.slice();

 insumosSeleccionados: Insumo[] = [];
 idInsumoSeleccionado: number;

 productosDetalle$: Observable<ProductoDetalle[]>;

  constructor(private productoService: ProductoService,
    private categoriaProductoService: CategoriaProductoService,
    private route: ActivatedRoute,
    private router: Router,
    private insumoService: InsumoService,
    private unidadService: UnidadService,
    private snackBar: MatSnackBar,
    private productoDetalleService: ProductoDetalleService) { }

  ngOnInit(): void {
    this.listarCategoriaProductos();
    this.listarInsumos()
    this.listarUnidades()
    this.producto = new Producto();

    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombre': new FormControl(''),
      'descripcion': new FormControl(''),
      'precio': new FormControl(''),
      'categoriaProducto': new FormControl(''),
      'cantidad': new FormControl(''),
      'insumo': new FormControl(''),
      'unidad': new FormControl(''),
    })

    this.route.params.subscribe((params: Params) => {
      this.idProducto = params['id'];
      this.edicion = params['id'] != null;
      this.initForm();
    });
  }

  initForm() {
    if (this.edicion) {
      this.productoService.listarPorId(this.idProducto).subscribe(data => {

        let id = data.idProducto;
        let nombre = data.nombre;

        this.form = new FormGroup({
          'id': new FormControl(id),
          'nombre': new FormControl(nombre),
          'descripcion': new FormControl(data.descripcion),
          'categoriaProducto': new FormControl(data.categoriaProducto),
          'precio': new FormControl(data.precio),
          'categoriaInsumo': new FormControl(''),
          'cantidad': new FormControl(''),
          'insumo': new FormControl(''),
      'unidad': new FormControl(''),
        });


        this.productoDetalleService.listarProductosDetalle(id).subscribe(data => {
          this.productoDetalleArr = data
        });

      });
    }
  }


  operar() {
    console.log('entro a operar')
    this.producto.idProducto = this.form.value['id'];
    this.producto.nombre = this.form.value['nombre'];
    this.producto.precio = this.form.value['precio'];
    this.producto.descripcion = this.form.value['descripcion'];
    let categoriaProducto = new CategoriaProducto()
    categoriaProducto = this.form.value['categoriaProducto'];
    this.producto.categoriaProducto = categoriaProducto;
    let destino = new Destino()
    destino.idDestino = 1
    this.producto.destino = destino
    // this.producto.productoDetalles = this.productoDetalleArr
    let productoDto = new ProductoDto()
    productoDto.producto = this.producto
    productoDto.productoDetalles = this.productoDetalleArr
    console.log(productoDto)

    if (this.producto != null && this.producto.idProducto > 0) {

      //BUENA PRACTICA
      this.productoService.registrarTransaccion(productoDto).pipe(switchMap(() => {
        return this.productoService.listar();
      })).subscribe(data => {
        this.productoService.setProductoCambio(data);
        this.productoService.setMensajeCambio("Se modificó");
      });

    } else {
      //PRACTICA COMUN
      this.productoService.registrarTransaccion(productoDto).pipe(switchMap(() => {
        return this.productoService.listar()
      })).subscribe(data => {
        this.productoService.setProductoCambio(data)
        this.productoService.setMensajeCambio("Se registró")
      })
    }

    this.router.navigate(['producto']);
  }


  listarCategoriaProductos() {
    this.categoriaProductos$ = this.categoriaProductoService.listar();

  }

  listarInsumos() {
    this.insumos$ = this.insumoService.listar();

  }

  listarUnidades() {
    this.unidades$ = this.unidadService.listar();
  }

  // listarProductoDetalles(id: any) {
  //   this.productosDetalle$ = this.productoDetalleService.listarProductosDetalle(id);
  // }

  public objectComparisonFunction = function( option: any, value: any ) : boolean {
    return option.idCategoriaProducto === value.idCategoriaProducto;
  }

  agregarInsumo() {

    if (this.insumo !== undefined) {

      let cont = 0;
      for (let i = 0; i < this.productoDetalleArr.length; i++) {
        let productoDetalle = this.productoDetalleArr[i];
        if (productoDetalle.insumo.idInsumo === this.insumo.idInsumo) {
          cont++;
          break;
        }
      }

      if (cont > 0) {
        let mensaje = 'El insumo se encuentra en la lista';
        this.snackBar.open(mensaje, "Aviso", { duration: 2000 });
      } else {
        let productoDetalle = new ProductoDetalle()
        productoDetalle.cantidad = this.cantidad
        productoDetalle.insumo = this.insumo
        productoDetalle.unidad = this.unidad
        this.productoDetalleArr.push(productoDetalle);
      }
    }

  }

  removerInsumo(index: number) {
    this.insumosSeleccionados.splice(index, 1);
  }
}
