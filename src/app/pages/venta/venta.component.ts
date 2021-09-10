import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VentaService } from './../../_service/venta.service';
import { Venta } from './../../_model/venta';
import { TipoReciboService } from './../../_service/tipo-recibo.service';
import { ClienteService } from './../../_service/cliente.service';
import { FormControl } from '@angular/forms';
import { PedidoDetalleService } from './../../_service/pedido-detalle.service';
import { PedidoDetalle } from './../../_model/pedido-detalle';
import { PedidoMesaDto } from './../../_dto/pedidoMesaDto';
import { Mesa } from './../../_model/mesa';
import { PedidoService } from './../../_service/pedido.service';
import { Observable } from 'rxjs';
import { Pedido } from './../../_model/pedido';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/_model/cliente';
import { TipoRecibo } from 'src/app/_model/tipo-recibo';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {
  form: FormGroup
  pedido: Pedido
  // pedidos$: Observable<Pedido[]>;
  mesas: Mesa[]
  // pedidoMesa: PedidoMesaDto
  pedidoMesaArr: PedidoMesaDto[]
  pedidosMesa$: Observable<PedidoMesaDto[]>;

  pedidoDetalleArr: PedidoDetalle[] = []
  pedidoDetalle$: Observable<PedidoDetalle[]>;
  clientes$: Observable<Cliente[]>;
  total: number = 0.0
  tipoRecibos$: Observable<TipoRecibo[]>;

  efectivo: number = 0
  tempEfectivo: number = 0
  visa: number = 0
  tempVisa: number = 0
  mastercard: number = 0
  tempMasterCard: number = 0
  vuelto: number = 0.0

  constructor(private pedidoService: PedidoService,
    private pedidoDetalleService: PedidoDetalleService,
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private tipoReciboService: TipoReciboService,
    private snackBar: MatSnackBar,
    private ventaService: VentaService) { }

  ngOnInit(): void {
    this.listarPedidosMesa()
    this.listarClientes()
    this.listarTipoRecibo()

    this.form = this.fb.group({
      'numVenta': new FormControl(''),
      'cliente': new FormControl(''),
      'tipoRecibo': new FormControl(''),
      'efectivo': new FormControl(''),
      'visa': new FormControl(''),
      'mastercard': new FormControl(''),
      'vuelto': new FormControl(''),
    })
  }


  registrarVenta() {
    let venta = new Venta()
    venta.numVenta = this.form.value['numVenta'];
    // venta.cliente = this.form.value['cliente']descomentar
    venta.tipoRecibo = this.form.value['tipoRecibo']
    venta.pedido = this.pedido
    venta.visa = this.visa
    venta.mastercard = this.mastercard
    venta.efectivo = this.efectivo
    venta.total = this.total
    console.log(venta)

    this.ventaService.registrar(venta).subscribe(data => {
      console.log(data)
      this.listarPedidosMesa()
      this.snackBar.open("SE REGISTRO", "Aviso", { duration: 2000 });
    })

    this.listarPedidosMesa()
    this.pedidoDetalleArr = []
    this.form.reset()

  }

  listarPedidosMesa() {

    this.pedidosMesa$ = this.pedidoService.listarPorPedidoMesa();
    this.pedidosMesa$.subscribe(productos => this.pedidoMesaArr = productos)
  }

  listarDetalles(pedidoMesaDto: PedidoMesaDto) {
    console.log(pedidoMesaDto)
    this.pedidoDetalle$ = this.pedidoDetalleService.listarPedidoDetallePorPedido(pedidoMesaDto.idPedido)
    this.pedidoDetalle$.subscribe(det => this.pedidoDetalleArr = det)
    console.log('antes pedidoDetalleArr')
    console.log(this.pedidoDetalleArr)
    this.total = pedidoMesaDto.pedido.total
    this.pedido = pedidoMesaDto.pedido
  }


  mostrarAPagar(pedidoDetalle: PedidoDetalle) {

  }

  listarClientes() {
    this.clientes$ = this.clienteService.listar()
  }

  listarTipoRecibo() {
    this.tipoRecibos$ = this.tipoReciboService.listar()
  }


  calculoDiferenciaEfectivo(efectivo: number) {

    if (efectivo > 0) {
      this.efectivo = efectivo
      this.tempEfectivo = efectivo
      this.vuelto = this.total - this.efectivo - this.visa - this.mastercard
    } else {
      if (this.total === (Number(this.vuelto) + Number(this.tempEfectivo))) {
        this.vuelto = 0
      } else {
        this.vuelto = Number(this.vuelto) + Number(this.tempVisa)
      }
    }
  }

  calculoDiferenciaVisa(visa: number) {
    if (visa > 0) {
      this.visa = visa
      this.tempVisa = visa
      this.vuelto = this.total - this.efectivo - this.visa - this.mastercard
    } else {

      if (this.total === (Number(this.vuelto) + Number(this.tempVisa))) {
        this.vuelto = 0
      } else {
        this.vuelto = Number(this.vuelto) + Number(this.tempEfectivo)
      }
    }

  }

  calculoDiferenciaMastercard(mastercard: number) {
    if (mastercard > 0) {
      this.mastercard = mastercard
      this.tempMasterCard = mastercard
      this.vuelto = this.total - this.efectivo - this.visa - this.mastercard
    } else {

      if (this.total === (Number(this.vuelto) + Number(this.mastercard))) {
        this.vuelto = 0
      } else {
        this.vuelto = Number(this.vuelto) + Number(this.tempMasterCard)
      }
    }

  }

}
