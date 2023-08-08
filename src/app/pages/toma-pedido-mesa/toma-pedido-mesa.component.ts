import { TipoPedido } from './../../_model/tipo-pedido';
import { CategoriaProductoService } from './../../_service/categoria-producto.service';
import { CategoriaProducto } from './../../_model/categoria-producto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductoDetalle } from './../../_model/producto-detalle';

import { ProductoService } from './../../_service/producto.service';
import { Producto } from './../../_model/producto';
import { UntypedFormControl, UntypedFormArray, UntypedFormBuilder } from '@angular/forms';
import { UntypedFormGroup } from '@angular/forms';
import { MesaService } from './../../_service/mesa.service';
import { Mesa } from './../../_model/mesa';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Pedido } from '../../_model/pedido';
import { PedidoDetalle } from '../../_model/pedido-detalle';
import { PedidoDto } from '../../_dto/pedidoDto';
import { PedidoService } from '../../_service/pedido.service';
import { switchMap } from 'rxjs/operators';
import { Cliente } from 'src/app/_model/cliente';
import { Empleado } from 'src/app/_model/empleado';
import { ClienteService } from 'src/app/_service/cliente.service';
import { EmpleadoService } from 'src/app/_service/empleado.service';


@Component({
  selector: 'app-toma-pedido-mesa',
  templateUrl: './toma-pedido-mesa.component.html',
  styleUrls: ['./toma-pedido-mesa.component.css']
})
export class TomaPedidoMesaComponent implements OnInit {
  @Input() nombre: string;
  mesas$: Observable<Mesa[]>;
  productos$: Observable<Producto[]>;
  form: UntypedFormGroup
  edicion: boolean = false;
  mesas: Mesa[] = []
  // producto: Producto
  mesaSeleccionada: Mesa[]
  carta: Producto[]
  // pedido: Pedido
  // conteo: number = 0
  pedidoDetalleArr: PedidoDetalle[] = []
  // pedidosDetalle= new FormArray([]);
  categoriaProducto: CategoriaProducto
  categoriasProducto$: Observable<CategoriaProducto[]>;
 total : number = 0
 clienteSeleccionado: Cliente
 clientes$: Observable<Cliente[]>;
 mozoSeleccionado: Empleado
 mozos$: Observable<Empleado[]>;
  constructor(private mesaService: MesaService,
              private productoService: ProductoService,
              private cdRef: ChangeDetectorRef,
              private fb: UntypedFormBuilder,
              private pedidoService: PedidoService,
              private snackBar: MatSnackBar,
              private categoriaProductoService: CategoriaProductoService,
              private clienteService: ClienteService,
              private empleadoService: EmpleadoService,) { }

  ngOnInit(): void {
    this.listarClientes()
    this.listarMozos()
  this.listarMesas()
  // this.listarProductos()
  this.listarCategoriasProducto()
   this.form = this.fb.group({
      'id': new UntypedFormControl(0),
      'mesas': new UntypedFormControl(''),
      'clientes': new UntypedFormControl(''),
      'mozos': new UntypedFormControl(''),
      'categoriaProducto': new UntypedFormControl(''),
      pedidosDetalle: this.fb.array([]),

   })

  }


  get pedidosDetalle(){
    return this.form.controls['pedidosDetalle'] as UntypedFormArray
  }

  addPedidoDetalle(carta: Producto){
    let cont = 0;
    for (let i = 0; i < this.pedidosDetalle.length; i++) {
      let pedidoDetalle = this.pedidosDetalle.controls[i];
      if (pedidoDetalle.value['producto'].idProducto === carta.idProducto) {
        cont++;
        break;
      }
    }

    if (cont > 0) {
      let mensaje = 'El producto se encuentra en la lista';
      this.snackBar.open(mensaje, "Aviso", { duration: 2000 });
    } else {
      this.nombre = carta.nombre
      const pedidoDetalleForm = this.fb.group({
      'producto': new UntypedFormControl(carta),
      'nombre': new UntypedFormControl(carta.nombre),
      'cantidad': new UntypedFormControl(0),
      'observacion': new UntypedFormControl(''),
    })
    console.log(pedidoDetalleForm)
    this.pedidosDetalle.push(pedidoDetalleForm)
    }
  }

  initForm() {

  }

  listarClientes() {
    this.clientes$ = this.clienteService.listar();
  }
  listarMozos() {
    this.mozos$ = this.empleadoService.listar();
  }
  registrarPedido() {

    let pedido = new Pedido()
    pedido.idPedido = this.form.value['id'];
    pedido.cliente = this.clienteSeleccionado;
    pedido.empleado = this.mozoSeleccionado
    let total = 0
    this.pedidosDetalle.controls.forEach((element, index) => {
      let pedidoDetalle = new PedidoDetalle()
      pedidoDetalle.cantidad = element.value['cantidad']
      pedidoDetalle.observacion = element.value['observacion']
      pedidoDetalle.producto =element.value['producto']
      this.pedidoDetalleArr.push(pedidoDetalle)
      total = total + pedidoDetalle.cantidad * pedidoDetalle.producto.precio
    })
    this.total = total
    pedido.total = this.total

    let tipoPedido = new TipoPedido()
    tipoPedido.idTipoPedido = 2
    pedido.tipoPedido = tipoPedido

    const pedidoDto = new PedidoDto()
    pedidoDto.pedido = pedido;
    pedidoDto.pedidoDetalles = this.pedidoDetalleArr
    let mesas = this.form.value['mesas']
    pedidoDto.mesas = mesas

    this.pedidoService.registrarTransaccion(pedidoDto).subscribe(data => {
      this.snackBar.open("SE REGISTRO", "Aviso", { duration: 2000 });
      this.listarMesas()
      this.listarCategoriasProducto()
  });
  this.carta = []
  this.mesaSeleccionada = []
  this.pedidosDetalle.controls = []
  }

  listarMesas() {
    this.mesas$ = this.mesaService.listar();
  }


  listarCategoriasProducto() {
    this.categoriasProducto$ = this.categoriaProductoService.listar();
  }



  removerMesa(index: number) {
    this.mesaSeleccionada.splice(index, 1);
  }

  productoEscogido(carta: Producto){
    console.log(carta)
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

   seleccionProductoCategoria(c: CategoriaProducto){
    this.productos$ = this.productoService.listarPorCategoria(c.idCategoriaProducto);
    this.productos$.subscribe(productos => this.carta = productos)
   }
}
