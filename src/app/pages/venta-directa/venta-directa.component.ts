import { StompService } from './../../_service/stomp.service';
import { ProductoDetalle } from './../../_model/producto-detalle';
import { VentaDto } from './../../_dto/ventaDto';
import { VentaService } from './../../_service/venta.service';
import { Venta } from './../../_model/venta';
import { TipoReciboService } from './../../_service/tipo-recibo.service';
import { EmpleadoService } from './../../_service/empleado.service';
import { Empleado } from './../../_model/empleado';
import { PedidoDetalleService } from './../../_service/pedido-detalle.service';
import { Pedido } from './../../_model/pedido';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductoService } from './../../_service/producto.service';
import { Cliente } from './../../_model/cliente';
import { TipoRecibo } from 'src/app/_model/tipo-recibo';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { Producto } from 'src/app/_model/producto';
import { map, startWith } from 'rxjs/operators';
import { ClienteService } from 'src/app/_service/cliente.service';
import { ClienteEdicionDirectoComponent } from './cliente-edicion-directo/cliente-edicion-directo.component';

import { PedidoDetalle } from 'src/app/_model/pedido-detalle';
import { PedidoService } from 'src/app/_service/pedido.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoPedido } from 'src/app/_model/tipo-pedido';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-venta-directa',
  templateUrl: './venta-directa.component.html',
  styleUrls: ['./venta-directa.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class VentaDirectaComponent implements OnInit {
  // para pedidos
  dataSource: MatTableDataSource<Pedido>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  cantidad: number = 0;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  tipoRecibos$: Observable<TipoRecibo[]>;
  form: FormGroup
  clientesFiltrados$: Observable<Cliente[]>;
  productosFiltrados$: Observable<Producto[]>;
  empleadosFiltrados$: Observable<Empleado[]>;
  clientes: Cliente[]
  empleados: Empleado[]
  productos: Producto[]
  myControlCliente: FormControl = new FormControl();
  myControlProducto: FormControl = new FormControl();
  myControlEmpleado: FormControl = new FormControl();

  dni: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  email: string;
  direccion: string;
  cliente: Cliente

  filteredOptions: Observable<Cliente[]>;
  // dataSource: FormGroup[] = []
  total: number = 0.0;
  displayedColumns = [
    'expandir',
    // 'idPedido',
    'cliente',
    'mozo',
    // 'precio',
    'estado',
    'descripcion',
    'acciones',

  ];

  displayedColumnsDetalle = [
    'producto',
    'cantidad'
  ]


  efectivo: number = 0
  tempEfectivo: number = 0
  visa: number = 0
  tempVisa: number = 0
  mastercard: number = 0
  tempMasterCard: number = 0
  vuelto: number = 0.0

  pedidoDetalleArr: PedidoDetalle[] = []
  productoArr: Producto[] = []

  expandedElement: Pedido | null;


  isTableExpanded = false;

  constructor(private fb: FormBuilder,
    private clienteService: ClienteService,
    private productoService: ProductoService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private empleadoService: EmpleadoService,
    private pedidoService: PedidoService,
    private pedidoDetalleService: PedidoDetalleService,
    private tipoReciboService: TipoReciboService,
    private ventaService: VentaService,
    private changeDetectorRefs: ChangeDetectorRef,
    private stompService: StompService,) { }

  ngOnInit(): void {

    this.listarPedidos()
    this.actualizarPedidosPorSocket()

    this.form = this.fb.group({
      'tipoRecibo': new FormControl(''),
      'cliente': this.myControlCliente,
      'producto': this.myControlProducto,
      'observacion': new FormControl(''),
      'empleado': this.myControlEmpleado,
      'numVenta': new FormControl(''),
      'efectivo': new FormControl(''),
      'visa': new FormControl(''),
      'mastercard': new FormControl(''),
      'vuelto': new FormControl(''),

      pedidosDetalle: this.fb.array([]),
    })
    this.listarTipoRecibo()
    this.listarClientes()
    this.listarProductos()
    this.listarEmpleados()
    this.clientesFiltrados$ = this.myControlCliente.valueChanges.pipe(map(val => this.filtrarClientes(val)));
    this.productosFiltrados$ = this.myControlProducto.valueChanges.pipe(map(val => this.filtrarProductos(val)));
    this.empleadosFiltrados$ = this.myControlEmpleado.valueChanges.pipe(map(val => this.filtrarEmpleados(val)));

  }

  listarTipoRecibo() {
    this.tipoRecibos$ = this.tipoReciboService.listar()
  }

  listarPedidos() {

    this.pedidoService.getPedidoCambio().subscribe(data => {
      this.crearTabla(data);
    });

    this.pedidoService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', { duration: 2000 });
    });


    console.log('entro')
    this.pedidoService.listarPageable(0, 5).subscribe(data => {
      console.log('listarPAginado')
      console.log(data)
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
      this.changeDetectorRefs.detectChanges();
    });

  }

  crearTabla(data: Pedido[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  get pedidosDetalle() {
    return this.form.controls['pedidosDetalle'] as FormArray
  }

  setValueFromDialog(cliente: Cliente): void {
    this.myControlCliente.setValue(cliente);
    this.filteredOptions = this.myControlCliente.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filtrarClientes(cliente))
        // map(value => typeof value === 'string' ? value : value.name),
        // map(cliente => cliente ? cliente.toLowerCase() : cliente.nombres)
      );
  }




  filtrarProductos(val: any) {
    if (val != null && val.idProducto > 0) {
      return this.productos.filter(el =>
        el.nombre.toLowerCase().includes(val.nombre.toLowerCase())
      );
      //EMPTY de RxJS
    }
    return this.productos.filter(el =>
      el.nombre.toLowerCase().includes(val?.toLowerCase())
    );
  }

  filtrarClientes(val: any) {
    if (val != null && val.idCliente > 0) {
      return this.clientes.filter(el =>
        el.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || el.apellidoPaterno.toLowerCase().includes(val.apellidoPaterno.toLowerCase()) || el.apellidoMaterno.toLowerCase().includes(val.apellidoMaterno.toLowerCase()) || el.dni.includes(val.dni)
      );
      //EMPTY de RxJS
    }
    return this.clientes.filter(el =>
      el.nombres.toLowerCase().includes(val?.toLowerCase()) || el.apellidoPaterno.toLowerCase().includes(val?.toLowerCase()) || el.apellidoMaterno.toLowerCase().includes(val?.toLowerCase()) || el.dni.includes(val)
    );
  }

  filtrarEmpleados(val: any) {
    if (val != null && val.idEmpleado > 0) {
      return this.empleados.filter(el =>
        el.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || el.apellidoPaterno.toLowerCase().includes(val.apellidoPaterno.toLowerCase()) || el.apellidoMaterno.toLowerCase().includes(val.apellidoMaterno.toLowerCase()) || el.dni.includes(val.dni)
      );
      //EMPTY de RxJS
    }
    return this.empleados.filter(el =>
      el.nombres.toLowerCase().includes(val?.toLowerCase()) || el.apellidoPaterno.toLowerCase().includes(val?.toLowerCase()) || el.apellidoMaterno.toLowerCase().includes(val?.toLowerCase()) || el.dni.includes(val)
    );
  }

  listarClientes() {
    this.clienteService.listar().subscribe(data => {
      this.clientes = data;
    });
  }

  listarProductos() {
    this.productoService.listar().subscribe(data => {
      this.productos = data;
    });
  }

  listarEmpleados() {
    this.empleadoService.listar().subscribe(data => {
      this.empleados = data;
    });
  }

  mostrarCliente(val: Cliente) {
    return val ? `${val.apellidoPaterno} ${val.apellidoMaterno} ${val.nombres} ` : val;
  }

  mostrarEmpleado(val: Empleado) {
    return val ? `${val.apellidoPaterno} ${val.apellidoMaterno} ${val.nombres} ` : val;
  }

  mostrarProducto(val: Producto) {
    return val ? `${val.nombre}  ` : val;
  }

  openDialog(): void {

    const dialogRef = this.dialog.open(ClienteEdicionDirectoComponent, {
      width: '500px',
      // height: '600px',
      maxHeight: '600px',
      data: {
        nombres: this.nombres,
        apellidoPaterno: this.apellidoPaterno,
        apellidoMaterno: this.apellidoMaterno,
        telefono: this.telefono,
        email: this.email,
        direccion: this.direccion,

      }
    });


    dialogRef.afterClosed().subscribe(result => {
      this.listarClientes()
      // this.filtrarClientes(val)
      console.log('The dialog was closed', result);
      this.setValueFromDialog(result);
    });
  }

  onSelectionChanged(event: any) {
    let producto = event.option.value

    if (producto !== null || producto !== undefined) {

      let cont = 0;
      for (let i = 0; i < this.pedidosDetalle.length; i++) {
        let pedidoDetalle = this.pedidosDetalle.controls[i];
        if (pedidoDetalle.value['producto'].idProducto === producto.idProducto) {
          cont++;
          break;
        }
      }

      if (cont > 0) {
        let mensaje = 'El producto se encuentra en la lista';
        this.myControlProducto.setValue('');
        this.snackBar.open(mensaje, "Aviso", { duration: 2000 });
      } else {
        // this.nombre = producto.nombre
        const pedidoDetalleForm = this.fb.group({
          'categoria': new FormControl(producto.categoriaProducto.nombre),
          'producto': new FormControl(producto),
          'nombre': new FormControl(producto.nombre),
          'cantidad': new FormControl(0),
          'precio': new FormControl(producto.precio),
          'stock': new FormControl(producto.stock),
          'importe': new FormControl(0)
        })
        console.log(pedidoDetalleForm)
        this.pedidosDetalle.push(pedidoDetalleForm)
        this.myControlProducto.setValue('');
      }
    }
  }



  onEnter() {

    if (this.form.value['producto'] !== '') {
      let producto = new Producto()
      producto = this.form.value['producto']
      let cont = 0;
      for (let i = 0; i < this.pedidosDetalle.length; i++) {
        let pedidoDetalle = this.pedidosDetalle.controls[i];
        if (pedidoDetalle.value['producto'].idProducto === producto.idProducto) {
          cont++;
          break;
        }
      }

      if (cont > 0) {
        let mensaje = 'El producto se encuentra en la lista';
        this.myControlProducto.setValue('');
        this.snackBar.open(mensaje, "Aviso", { duration: 2000 });
      } else {
        // this.nombre = producto.nombre
        const pedidoDetalleForm = this.fb.group({
          'categoria': new FormControl(producto.categoriaProducto.nombre),
          'producto': new FormControl(producto),
          'nombre': new FormControl(producto.nombre),
          'cantidad': new FormControl(0),
          'precio': new FormControl(producto.precio),
          'stock': new FormControl(producto.stock),
          'importe': new FormControl(0)
        })

        this.pedidosDetalle.push(pedidoDetalleForm)
        this.myControlProducto.setValue('');
      }
    }
  }

  removerProducto(i: number) {

    let importe = this.pedidosDetalle.controls[i].value['importe']
    console.log(importe)
    this.total = this.total - importe
    this.pedidosDetalle.controls.splice(i, 1);
  }

  getCategorioLabel(i: number) {
    return this.pedidosDetalle.controls[i].value['categoria']
  }
  getProductoLabel(i: number) {
    return this.pedidosDetalle.controls[i].value['nombre']
  }
  getCantidadLabel(i: number) {
    return this.pedidosDetalle.controls[i].value['cantidad']
  }
  getPrecioLabel(i: number) {
    return this.pedidosDetalle.controls[i].value['precio']
  }
  getStockLabel(i: number) {
    return this.pedidosDetalle.controls[i].value['stock']
  }
  getImporteLabel(i: number) {
    return this.pedidosDetalle.controls[i].value['importe']
  }

  getTotalLabel() {

    return Number(this.total.toFixed(2))
  }

  removerCantidad(i: number) {
    let conteo = this.pedidosDetalle.controls[i].value['cantidad']
    if (conteo > 0) {
      conteo = conteo - 1
      this.pedidosDetalle.at(i).get('cantidad')?.patchValue(conteo)

      //calcular stock
      let stock = this.pedidosDetalle.controls[i].value['stock']
      stock = stock + 1
      this.pedidosDetalle.at(i).get('stock')?.patchValue(stock)
      //calcular precio
      let precio = this.pedidosDetalle.controls[i].value['precio']
      let importe = conteo * precio
      this.pedidosDetalle.at(i).get('importe')?.patchValue(importe)


      if (this.total > 0) {
        this.total -= precio
      }
    }
  }
  agregarCantidad(i: number) {

    //funciona el de abajo
    let conteo = this.pedidosDetalle.controls[i].value['cantidad']
    conteo = conteo + 1
    this.pedidosDetalle.at(i).get('cantidad')?.patchValue(conteo)
    //calcular precio
    let precio = this.pedidosDetalle.controls[i].value['precio']
    let importe = conteo * precio
    this.pedidosDetalle.at(i).get('importe')?.patchValue(importe)
    //calcular stock
    let stock = this.pedidosDetalle.controls[i].value['stock']
    stock = stock - 1
    this.pedidosDetalle.at(i).get('stock')?.patchValue(stock)
    this.total += precio

  }

  calculoDiferenciaEfectivo(efectivo: number) {

    if (efectivo > 0) {
      this.efectivo = efectivo
      this.tempEfectivo = efectivo
      this.vuelto = this.total - this.efectivo - this.visa - this.mastercard
      if (this.vuelto > 0) {
        this.vuelto = Number(this.vuelto.toFixed(2))
      } else {
        this.vuelto = 0
      }
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
      if (this.vuelto > 0) {
        this.vuelto = Number(this.vuelto.toFixed(2))
      } else {
        this.vuelto = 0
      }
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
      if (this.vuelto > 0) {
        this.vuelto = Number(this.vuelto.toFixed(2))
      } else {
        this.vuelto = 0
      }
    } else {

      if (this.total === (Number(this.vuelto) + Number(this.mastercard))) {
        this.vuelto = 0
      } else {
        this.vuelto = Number(this.vuelto) + Number(this.tempMasterCard)
      }
    }
  }


  registrarVenta() {
    let tipoPedido = new TipoPedido()
    tipoPedido.idTipoPedido = 1
    //datos del pedido
    let pedido = new Pedido()
    pedido.tipoPedido = tipoPedido
    // pedido.idPedido = this.form.value['id'];
    pedido.cliente = this.form.value['cliente']
    pedido.empleado = this.form.value['empleado']

    //detallepedido
    this.pedidosDetalle.controls.forEach((element, index) => {
      let pedidoDetalle = new PedidoDetalle()
      pedidoDetalle.cantidad = element.value['cantidad']
      // pedidoDetalle.observacion = element.value['observacion']

      let producto = element.value['producto']
      producto.stock = element.value['stock']
      // pedidoDetalle.producto =element.value['producto']
      pedidoDetalle.producto = producto
      this.productoArr.push(producto)
      this.pedidoDetalleArr.push(pedidoDetalle)
    })
    pedido.total = this.total

    // const pedidoDto = new PedidoDto()
    // pedidoDto.pedido = pedido;
    // pedidoDto.pedidoDetalles = this.pedidoDetalleArr
    console.log(pedido)
    console.log(this.pedidoDetalleArr)
    //datos del comprobante
    let venta = new Venta()
    venta.numVenta = this.form.value['numVenta'];
    venta.tipoRecibo = this.form.value['tipoRecibo']
    venta.visa = this.visa
    venta.mastercard = this.mastercard
    venta.efectivo = this.efectivo
    venta.total = this.total
    console.log(venta)


    let ventaDto = new VentaDto()
    ventaDto.pedido = pedido
    ventaDto.pedidoDetalles = this.pedidoDetalleArr
    ventaDto.venta = venta
    ventaDto.productos = this.productoArr


    this.ventaService.registrarTransaccion(ventaDto).subscribe(data => {
      this.listarPedidos()
      this.actualizarPedidosPorSocket()
      this.snackBar.open("SE REGISTRO", "Aviso", { duration: 2000 });
    })



    this.productoArr = []
    this.pedidoDetalleArr = []
    this.pedidosDetalle.controls = []
    this.total = 0
    this.form.reset()

  }

  mostrarMas(e: any) {
    this.pedidoService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });
  }

  toggleTableRows() {
    this.isTableExpanded = !this.isTableExpanded;
    this.dataSource.data.forEach((row: any) => {
      row.expandible = this.isTableExpanded;
    })
  }

  cambioEstadoPedido(pedido: Pedido) {
    this.pedidoService.actualizarEstado(pedido).subscribe(data => {
      this.listarPedidos()
      this.snackBar.open("SE Actualizo", "Aviso", { duration: 2000 });
    })
  }

  actualizarPedidosPorSocket() {
    this.stompService.subscribe('/topic/venta', (): void => {
      this.listarPedidos()
    })
  }
}

// https://stackblitz.com/edit/angular-material-table-with-form-59imvq?file=app%2Fapp.component.ts
// https://koderplace.com/blog/posts/11/using-angular-material-mattabledatasource-in-combination-with-formarray
