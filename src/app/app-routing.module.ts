import { TomaPedidoComponent } from './pages/toma-pedido/toma-pedido.component';
import { PedidoComponent } from './pages/pedido/pedido.component';
import { CategoriaInsumoEdicionComponent } from './pages/categoria-insumo/categoria-insumo-edicion/categoria-insumo-edicion.component';
import { InsumoComponent } from './pages/insumo/insumo.component';
import { ProductoEdicionComponent } from './pages/producto/producto-edicion/producto-edicion.component';
import { ProductoComponent } from './pages/producto/producto.component';
import { CategoriaInsumoComponent } from './pages/categoria-insumo/categoria-insumo.component';
import { EmpleadoComponent } from './pages/empleado/empleado.component';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';
import { CategoriaProductoComponent } from './pages/categoria-producto/categoria-producto.component';
import { MesaComponent } from './pages/mesa/mesa.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteComponent } from './pages/cliente/cliente.component';

const routes: Routes = [
  {
    path: 'cliente', component: ClienteComponent
  },
  {
    path: 'insumo', component: InsumoComponent
  },
  {
    path: 'mesa', component: MesaComponent
  },
  {
    path: 'categoria-insumo', component: CategoriaInsumoComponent, children: [
      { path: 'nuevo', component: CategoriaInsumoEdicionComponent },
      { path: 'edicion/:id', component: CategoriaInsumoEdicionComponent },
    ]
  },
  {
    path: 'categoria-producto', component: CategoriaProductoComponent
  },
  {
    path: 'empleado', component: EmpleadoComponent
  },
  {
    path: 'proveedor', component: ProveedorComponent
  },
  {
    path: 'producto', component: ProductoComponent, children: [
      { path: 'nuevo', component: ProductoEdicionComponent },
      { path: 'edicion/:id', component: ProductoEdicionComponent },
    ]
  },
  {
    path: 'pedido', component: PedidoComponent
  },
  {
    path: 'toma-pedido', component: TomaPedidoComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
