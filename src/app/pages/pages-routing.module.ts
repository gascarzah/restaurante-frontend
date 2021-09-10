import { InicioComponent } from './inicio/inicio.component';
import { Not403Component } from './not403/not403.component';
import { VentaDirectaComponent } from './venta-directa/venta-directa.component';
import { VentaComponent } from './venta/venta.component';
import { CompraEdicionComponent } from './compra/compra-edicion/compra-edicion.component';
import { CompraComponent } from './compra/compra.component';
import { TomaPedidoMesaComponent } from './toma-pedido-mesa/toma-pedido-mesa.component';
import { TomaPedidoComponent } from './toma-pedido/toma-pedido.component';
import { PedidoComponent } from './pedido/pedido.component';
import { ProductoEdicionComponent } from './producto/producto-edicion/producto-edicion.component';
import { ProductoComponent } from './producto/producto.component';
import { ProveedorComponent } from './proveedor/proveedor.component';
import { EmpleadoComponent } from './empleado/empleado.component';
import { CategoriaProductoComponent } from './categoria-producto/categoria-producto.component';
import { CategoriaInsumoEdicionComponent } from './categoria-insumo/categoria-insumo-edicion/categoria-insumo-edicion.component';
import { CategoriaInsumoComponent } from './categoria-insumo/categoria-insumo.component';
import { MesaComponent } from './mesa/mesa.component';
import { InsumoComponent } from './insumo/insumo.component';
import { ClienteComponent } from './cliente/cliente.component';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuardService } from '../_service/guard.service';
import { Not404Component } from './not404/not404.component';


const routes: Routes = [
  { path: 'inicio', component: InicioComponent, canActivate: [GuardService] },
  {
    path: 'cliente', component: ClienteComponent, canActivate: [GuardService]
  },
  {
    path: 'insumo', component: InsumoComponent, canActivate: [GuardService]
  },
  {
    path: 'mesa', component: MesaComponent, canActivate: [GuardService]
  },
  {
    path: 'categoria-insumo', component: CategoriaInsumoComponent, children: [
      { path: 'nuevo', component: CategoriaInsumoEdicionComponent },
      { path: 'edicion/:id', component: CategoriaInsumoEdicionComponent },
    ], canActivate: [GuardService]
  },
  {
    path: 'categoria-producto', component: CategoriaProductoComponent, canActivate: [GuardService]
  },
  {
    path: 'empleado', component: EmpleadoComponent, canActivate: [GuardService]
  },
  {
    path: 'proveedor', component: ProveedorComponent, canActivate: [GuardService]
  },
  {
    path: 'producto', component: ProductoComponent, children: [
      { path: 'nuevo', component: ProductoEdicionComponent },
      { path: 'edicion/:id', component: ProductoEdicionComponent },
    ], canActivate: [GuardService]
  },
  {
    path: 'pedido', component: PedidoComponent, canActivate: [GuardService]
  },
  {
    path: 'toma-pedido', component: TomaPedidoComponent, canActivate: [GuardService]
  },
  {
    path: 'toma-pedido-mesa', component: TomaPedidoMesaComponent, canActivate: [GuardService]
  },
  {
    path: 'compra', component: CompraComponent, canActivate: [GuardService]
  },
  {
    path: 'compra-nuevo', component: CompraEdicionComponent, canActivate: [GuardService]
  },
  {
    path: 'compra-edicion/:id', component: CompraEdicionComponent, canActivate: [GuardService]
  },
  {
    path: 'venta', component: VentaComponent, canActivate: [GuardService]
  },
  {
    path: 'venta-directa', component: VentaDirectaComponent, canActivate: [GuardService]
  },
  { path: 'not-403', component: Not403Component },
   { path: 'not-404', component: Not404Component },
  {
    path: '**',
    redirectTo: 'not-404'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
