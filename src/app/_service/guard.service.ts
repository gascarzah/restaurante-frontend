import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router,  RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Menu } from '../_model/menu';
import { LoginService } from './login.service';
import { MenuService } from './menu.service';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {

  constructor(
    private loginService: LoginService,
    private menuService: MenuService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      //1) VERIFICAR SI ESTA LOGUEADO
      let rpta = this.loginService.estaLogueado();
      if (!rpta) {
         console.log("al entrar");
        this.loginService.cerrarSesion();
        return false;
      } else {
        //2) VERIFICAR SI EL TOKEN NO HA EXPIRADO
        const helper = new JwtHelperService();
        let token = sessionStorage.getItem(environment.TOKEN_NAME)!;
        console.log("token");
        console.log(token);
        if (!helper.isTokenExpired(token)) {
          console.log("entra sesion");
          //3) VERIFICAR SI TIENES EL ROL NECESARIO PARA ACCEDER A ESA PAGINA

          //url -> /consulta
          let url = state.url;
          const decodedToken = helper.decodeToken(token);
          console.log("2");
          return this.menuService.listarPorUsuario(decodedToken.user_name).pipe(map((data: Menu[]) => {
            this.menuService.setMenuCambio(data);
            console.log("3");
            console.log(data);
            console.log(url);
            let cont = 0;
            for (let m of data) {
              console.log("4");
              if (url.startsWith(m.url)) {
                console.log("5");
                cont++;
                break;
              }
            }

            if (cont > 0) {
              console.log("46");
              return true;
            } else {
              console.log("7");
              this.router.navigate(['/pages/not-403']);
              return false;
            }

          }));

        } else {
          this.loginService.cerrarSesion();
          return false;
        }
      }

    }
  }
