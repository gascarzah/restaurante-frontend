

import { MaterialModule } from './material/material.module';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { EmpleadoComponent } from './pages/empleado/empleado.component';
import { ProductoComponent } from './pages/producto/producto.component';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';
import { PedidoComponent } from './pages/pedido/pedido.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CategoriaInsumoComponent } from './pages/categoria-insumo/categoria-insumo.component';
import { CategoriaProductoComponent } from './pages/categoria-producto/categoria-producto.component';
import { MesaComponent } from './pages/mesa/mesa.component';
import { InsumoComponent } from './pages/insumo/insumo.component';
import { MantenimientoComponent } from './pages/cliente/mantenimiento/mantenimiento.component';
import { ClienteEdicionComponent } from './pages/cliente/cliente-edicion/cliente-edicion.component';
import { ConfirmDialogComponent } from './pages/util/confirm-dialog/confirm-dialog.component';
import { EmpleadoEdicionComponent } from './pages/empleado/empleado-edicion/empleado-edicion.component';
import { ProveedorEdicionComponent } from './pages/proveedor/proveedor-edicion/proveedor-edicion.component';


import { CategoriaProductoEdicionComponent } from './pages/categoria-producto/categoria-producto-edicion/categoria-producto-edicion.component';
import { CategoriaInsumoEdicionComponent } from './pages/categoria-insumo/categoria-insumo-edicion/categoria-insumo-edicion.component';
import { ProductoEdicionComponent } from './pages/producto/producto-edicion/producto-edicion.component';
import { InsumoEdicionComponent } from './pages/insumo/insumo-edicion/insumo-edicion.component';
import { TomaPedidoComponent } from './pages/toma-pedido/toma-pedido.component';
import { MesaEdicionComponent } from './pages/mesa/mesa-edicion/mesa-edicion.component';


@NgModule({
  declarations: [
    AppComponent,
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

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    // PdfViewerModule


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
