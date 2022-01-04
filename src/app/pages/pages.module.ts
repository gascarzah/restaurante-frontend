import { TomaPedidoMesaComponent } from './toma-pedido-mesa/toma-pedido-mesa.component';
import { ClienteEdicionDirectoComponent } from './venta-directa/cliente-edicion-directo/cliente-edicion-directo.component';
import { VentaDirectaComponent } from './venta-directa/venta-directa.component';
import { VentaComponent } from './venta/venta.component';
import { CompraEdicionComponent } from './compra/compra-edicion/compra-edicion.component';
import { CompraComponent } from './compra/compra.component';
import { MesaEdicionComponent } from './mesa/mesa-edicion/mesa-edicion.component';
import { TomaPedidoComponent } from './toma-pedido/toma-pedido.component';
import { InsumoEdicionComponent } from './insumo/insumo-edicion/insumo-edicion.component';
import { ProductoEdicionComponent } from './producto/producto-edicion/producto-edicion.component';
import { ProveedorEdicionComponent } from './proveedor/proveedor-edicion/proveedor-edicion.component';
import { EmpleadoEdicionComponent } from './empleado/empleado-edicion/empleado-edicion.component';
import { ConfirmDialogComponent } from './util/confirm-dialog/confirm-dialog.component';
import { ClienteEdicionComponent } from './cliente/cliente-edicion/cliente-edicion.component';
import { MantenimientoComponent } from './cliente/mantenimiento/mantenimiento.component';
import { InsumoComponent } from './insumo/insumo.component';
import { MesaComponent } from './mesa/mesa.component';
import { CategoriaProductoEdicionComponent } from './categoria-producto/categoria-producto-edicion/categoria-producto-edicion.component';
import { CategoriaInsumoEdicionComponent } from './categoria-insumo/categoria-insumo-edicion/categoria-insumo-edicion.component';
import { CategoriaProductoComponent } from './categoria-producto/categoria-producto.component';
import { CategoriaInsumoComponent } from './categoria-insumo/categoria-insumo.component';
import { PedidoComponent } from './pedido/pedido.component';
import { ProveedorComponent } from './proveedor/proveedor.component';
import { ProductoComponent } from './producto/producto.component';
import { EmpleadoComponent } from './empleado/empleado.component';
import { ClienteComponent } from './cliente/cliente.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
// import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MaterialModule } from '../material/material.module';

import { PagesRoutingModule } from './pages-routing.module';

import { Not403Component } from './not403/not403.component';
import { Not404Component } from './not404/not404.component';
import { RecuperarComponent } from './login/recuperar/recuperar.component';
import { TokenComponent } from './login/recuperar/token/token.component';
import { LayoutComponent } from './layout/layout.component';
import { InicioComponent } from './inicio/inicio.component';


@NgModule({
  imports: [
    MaterialModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    // FlexLayoutModule,
    // PdfViewerModule,
    PagesRoutingModule
  ],
  exports: [],
  declarations: [
    ClienteComponent,
    EmpleadoComponent,
    ProductoComponent,
    ProveedorComponent,
    PedidoComponent,
    CategoriaInsumoComponent,
    CategoriaProductoComponent,
    CategoriaInsumoEdicionComponent,
    CategoriaProductoEdicionComponent,
    MesaComponent,
    InsumoComponent,
    MantenimientoComponent,
    ClienteEdicionComponent,
    ConfirmDialogComponent,
    EmpleadoEdicionComponent,
    ProveedorEdicionComponent,
    ProductoEdicionComponent,
    InsumoEdicionComponent,
    TomaPedidoComponent,
    MesaEdicionComponent,
    CompraComponent,
    CompraEdicionComponent,
    VentaComponent,
    Not404Component,
    VentaDirectaComponent,
    ClienteEdicionDirectoComponent,
    TomaPedidoMesaComponent,
    LayoutComponent,
    Not403Component,
    Not404Component,
    RecuperarComponent,
    TokenComponent,
    InicioComponent,

  ],
  providers: [],
})
export class PagesModule { }
