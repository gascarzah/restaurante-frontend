import { ProductoDetalle } from './../../_model/producto-detalle';

import { ProductoService } from './../../_service/producto.service';
import { Producto } from './../../_model/producto';
import { FormControl, FormArray, FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { MesaService } from './../../_service/mesa.service';
import { Mesa } from './../../_model/mesa';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Pedido } from '../../_model/pedido';
import { PedidoDetalle } from '../../_model/pedido-detalle';
import { PedidoDto } from '../../_dto/pedidoDto';
import { PedidoService } from '../../_service/pedido.service';
import { switchMap } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-toma-pedido',
  templateUrl: './toma-pedido.component.html',
  styleUrls: ['./toma-pedido.component.css']
})
export class TomaPedidoComponent implements OnInit {
  @Input() nombre: string;
  mesas$: Observable<Mesa[]>;
  productos$: Observable<Producto[]>;
  form: FormGroup
  edicion: boolean = false;
  mesas: Mesa[] = []
  // producto: Producto
  mesaSeleccionada: Mesa[]
  carta: Producto[]
  // pedido: Pedido
  // conteo: number = 0
  pedidoDetalleArr: PedidoDetalle[] = []
  // pedidosDetalle= new FormArray([]);

  constructor(private mesaService: MesaService,
              private productoService: ProductoService,
              private cdRef: ChangeDetectorRef,
              private fb: FormBuilder,
              private pedidoService: PedidoService) { }

  ngOnInit(): void {
  this.listarMesas()
  this.listarProductos()

   this.form = this.fb.group({
      'id': new FormControl(0),
      'mesas': new FormControl(''),
      'producto': new FormControl(''),
      pedidosDetalle: this.fb.array([]),

   })

  }


  get pedidosDetalle(){
    return this.form.controls['pedidosDetalle'] as FormArray
  }

  addPedidoDetalle(carta: Producto){
    this.nombre = carta.nombre
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


  registrarPedido() {
    // console.log('entro a operar')
    let pedido = new Pedido()
    pedido.idPedido = this.form.value['id'];
    // let mesa = new Mesa()
    // pedido.mesa = this.form.value['mesas']

    this.pedidosDetalle.controls.forEach((element, index) => {
      let pedidoDetalle = new PedidoDetalle()
      pedidoDetalle.cantidad = element.value['cantidad']
      pedidoDetalle.observacion = element.value['observacion']
      pedidoDetalle.producto =element.value['producto']
      this.pedidoDetalleArr.push(pedidoDetalle)
      // console.log('comienzo')
      // console.log(element.value['producto'])
      // console.log(element.value['nombre'])
      // console.log(element.value['cantidad'])
      // console.log(element.value['observacion'])
    })

    const pedidoDto = new PedidoDto()
    pedidoDto.pedido = pedido;
    pedidoDto.pedidoDetalles = this.pedidoDetalleArr
    let mesas = this.form.value['mesas']
    pedidoDto.mesas = mesas
    console.log(pedidoDto)
    this.pedidoService.registrarTransaccion(pedidoDto).pipe(switchMap(() => {
      return this.pedidoService.listar();
    })).subscribe(data => {
      this.pedidoService.setPedidoCambio(data);
      this.pedidoService.setMensajeCambio("Se modificó");
    });
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

  getNameLabel(i: number){
    return this.pedidosDetalle.controls[i].value['nombre']
   }


}
