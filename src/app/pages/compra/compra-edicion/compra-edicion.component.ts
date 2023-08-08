import { switchMap } from 'rxjs/operators';
import { CompraDto } from './../../../_dto/compraDto';
import { TipoReciboService } from './../../../_service/tipo-recibo.service';

import { ProveedorService } from './../../../_service/proveedor.service';
import { Proveedor } from './../../../_model/proveedor';

import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CompraDetalle } from './../../../_model/compra-detalle';
import { CompraDetalleService } from './../../../_service/compra-detalle.service';
import { CompraService } from './../../../_service/compra.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InsumoService } from './../../../_service/insumo.service';
import { Compra } from './../../../_model/compra';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { Insumo } from 'src/app/_model/insumo';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { TipoRecibo } from 'src/app/_model/tipo-recibo';


@Component({
  selector: 'app-compra-edicion',
  templateUrl: './compra-edicion.component.html',
  styleUrls: ['./compra-edicion.component.css']
})
export class CompraEdicionComponent implements OnInit {
  codigoCompra: string
  compraDetalleArr: CompraDetalle[] = []
  total: number = 0
  valor: string
  igv: string
  insumos$: Observable<Insumo[]>;
  proveedores$: Observable<Proveedor[]>;
  proveedor: Proveedor
  tipoRecibo: TipoRecibo
  insumo: Insumo
  form: UntypedFormGroup
  cantidad: number= 0;
  stock: number= 0;
  precioUnidad: number= 0;
  compra: Compra
  edicion: boolean = false;
  idCompra: number;
  tipoRecibos$ : Observable<TipoRecibo[]>
  numeroRecibo: string


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private insumoService: InsumoService,
    private snackBar: MatSnackBar,
    private compraService: CompraService,
    private proveedorService: ProveedorService,
    private compraDetalleService: CompraDetalleService,
    private tipoReciboService: TipoReciboService) {

     }

  ngOnInit(): void {


    this.listarTipoRecibos();
    this.listarInsumos()
    this.listarProveedores()
    this.compra = new Compra();

    this.form = new UntypedFormGroup({
      'id': new UntypedFormControl(0),
      'stock': new UntypedFormControl(''),
      'tipoRecibo': new UntypedFormControl(''),
      'precioUnidad': new UntypedFormControl(''),
      'proveedor': new UntypedFormControl(''),
      'cantidad': new UntypedFormControl(''),
      'insumo': new UntypedFormControl(''),
       'codigoCompra': new UntypedFormControl(''),
       'numeroRecibo': new UntypedFormControl('')
    })

    this.route.params.subscribe((params: Params) => {
      this.idCompra = params['id'];
      this.edicion = params['id'] != null;
      this.initForm();
    });

  }

  initForm() {
    if (this.edicion) {
      this.compraService.listarPorId(this.idCompra).subscribe(data => {

        let id = data.idCompra;


        this.form = new UntypedFormGroup({
          'id': new UntypedFormControl(id),
          'stock': new UntypedFormControl(''),
          'cantidad': new UntypedFormControl(),
          'precioUnidad': new UntypedFormControl(''),
          'insumo': new UntypedFormControl(),
          'proveedor': new UntypedFormControl(''),
          'codigoCompra': new UntypedFormControl(''),
          'tipoRecibo': new UntypedFormControl(''),
          'numeroRecibo': new UntypedFormControl(''),
        });


        // this.compraDetalleService.listarProductosDetalle(id).subscribe(data => {
        //   this.compraDetalleArr = data
        // });

      });
    }
  }



  agregarInsumo(){
    if( this.insumo == null  ){
      this.snackBar.open("Falta elegir un insumo", "Aviso", { duration: 2000 });
    }else if( this.cantidad ===0  ){
      this.snackBar.open("Falta poner la cantidad", "Aviso", { duration: 2000 });
    }else if( this.precioUnidad === 0 ){
      this.snackBar.open("Falta ingresar precio", "Aviso", { duration: 2000 });
    }else{


      let cont = 0;
      for (let i = 0; i < this.compraDetalleArr.length; i++) {
        let compraDetalle = this.compraDetalleArr[i];
        if (compraDetalle.insumo.idInsumo === this.insumo.idInsumo) {
          cont++;
          break;
        }
      }

      if (cont > 0) {
        let mensaje = 'El insumo se encuentra en la lista';
        this.snackBar.open(mensaje, "Aviso", { duration: 2000 });
      } else {
        let compraDetalle = new CompraDetalle()
        compraDetalle.insumo = this.insumo
        compraDetalle.cantidad = this.cantidad
        compraDetalle.precioUnidad = this.precioUnidad
        compraDetalle.total = parseFloat((this.cantidad * this.precioUnidad).toFixed(2))

        this.compraDetalleArr.push(compraDetalle)
        this.total = parseFloat((this.total + compraDetalle.total).toFixed(2))
        this.valor = (this.total * 0.82).toFixed(2)
        this.igv = (this.total * 0.18 ).toFixed(2)

        this.insumo = new Insumo()
        this.cantidad = 0
        this.precioUnidad = 0
        this.stock = 0
      }
    }
  }


  removerCompra(index: number){
    this.compraDetalleArr.splice(index, 1);
  }



  public objectCompraComparacionFunction = function( option: any, value: any ) : boolean {

    return option.idInsumo === value.idInsumo;
  }
  public objectProveedorComparacionFunction = function( option: any, value: any ) : boolean {

    return option.idProveedor === value.idProveedor;
  }
  listarInsumos() {
    this.insumos$ = this.insumoService.listar();
  }

  listarProveedores() {
    this.proveedores$ = this.proveedorService.listar();
  }

  listarTipoRecibos() {
    this.tipoRecibos$ = this.tipoReciboService.listar();
  }

  seleccionInsumo(insumo: Insumo){

    this.stock = insumo.stockMinimo

  }

  registrar(){
    console.log('llego')
    let compra = new Compra()
    compra.codigoCompra = this.codigoCompra
    compra.igv = Number(this.igv)
    compra.valor = Number(this.valor)
    compra.numeroRecibo = this.numeroRecibo
    compra.proveedor = this.form.value['proveedor']
    compra.tipoRecibo = this.form.value['tipoRecibo']
    compra.total = this.total
    let compraDto = new CompraDto()
    compraDto.compra = compra
    compraDto.compraDetalles = this.compraDetalleArr

    console.log(compraDto)
    this.compraService.registrarTransaccion(compraDto).pipe(switchMap(() => {
      return this.compraService.listar();
    })).subscribe(data => {
      this.compraService.setCompraCambio(data);
      this.compraService.setMensajeCambio("SE REGISTRO");
      this.snackBar.open("SE REGISTRO", "Aviso", { duration: 2000 });
      this.reset()
    });
  }

  reset(){
    this.form.reset()
    this.compraDetalleArr = []
    this.total = 0
    this.valor = '0'
    this.igv ='0'
  }
}
