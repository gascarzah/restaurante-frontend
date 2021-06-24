import { ProductoDetalle } from './../../_model/producto-detalle';
import { PedidoDetalle } from './../../_model/pedido-detalle';
import { ProductoService } from './../../_service/producto.service';
import { Producto } from './../../_model/producto';
import { FormControl, FormArray, FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { MesaService } from './../../_service/mesa.service';
import { Mesa } from './../../_model/mesa';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-toma-pedido',
  templateUrl: './toma-pedido.component.html',
  styleUrls: ['./toma-pedido.component.css']
})
export class TomaPedidoComponent implements OnInit {
  mesas$: Observable<Mesa[]>;
  productos$: Observable<Producto[]>;
  form: FormGroup
  edicion: boolean = false;
  mesa: Mesa
  producto: Producto
  mesaSeleccionada: Mesa[]
  carta: Producto[]
  // conteo: number = 0
  // pedidoDetalleArr: PedidoDetalle[] = []
  // pedidosDetalle= new FormArray([]);

  constructor(private mesaService: MesaService,
              private productoService: ProductoService,
              private cdRef: ChangeDetectorRef,
              private fb: FormBuilder) { }

  ngOnInit(): void {
  this.listarMesas()
  this.listarProductos()

   this.form = this.fb.group({
      id: new FormControl(0),
      mesa: new FormControl(''),
      producto: new FormControl(''),
      pedidosDetalle: this.fb.array([]),

   })

  }


  get pedidosDetalle(){
    return this.form.controls['pedidosDetalle'] as FormArray
  }

  addPedidoDetalle(carta: Producto){
    const pedidoDetalleForm = this.fb.group({
      'producto': new FormControl(carta),
      'nombre': new FormControl(carta.nombre),
      'cantidad': new FormControl(0),
      'observacion': new FormControl(''),
    })
    this.pedidosDetalle.push(pedidoDetalleForm)
    // this.pedidosDetalle.push(this.fb.group(new PedidoDetalle()))

  }

  initForm() {

  }


  operar() {
  }

  listarMesas() {
    this.mesas$ = this.mesaService.listar();
  }

  listarProductos() {
    this.productos$ = this.productoService.listar();
    this.productos$.subscribe(productos => this.carta = productos)
  }

  removerMesa(index: number) {
    this.mesaSeleccionada.splice(index, 1);
  }

  productoEscogido(carta: Producto){
    this.addPedidoDetalle(carta)
  }

  removerCantidad(i: number){
    let conteo =  this.pedidosDetalle.controls[i].value['cantidad']
    if(conteo > 0){
    conteo = conteo - 1
    this.pedidosDetalle.at(i).get('cantidad')?.patchValue(conteo)
  }
  }
  agregarCantidad(i: number){

  //funciona el de abajo
  let conteo =  this.pedidosDetalle.controls[i].value['cantidad']
  conteo = conteo + 1
  this.pedidosDetalle.at(i).get('cantidad')?.patchValue(conteo)

  }

  // getNombreProducto(i: number) {

  // }

}
