import { Injectable, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ProfilComponent } from './components/profil/profil.component';
import { RegisterComponent } from './components/register/register.component';
import { WallComponent } from './components/wall/wall.component';

@Injectable({
  providedIn:"root"
})
class GuardPreventGusetPageRender implements CanActivate {
  constructor(private router: Router){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    return window.localStorage.getItem('user')? this.router.createUrlTree(['/']) : true
  }
} 


const routes: Routes = [
  {
    path: "login",
    canActivate: [GuardPreventGusetPageRender],
    component: LoginComponent
  },
  {
    path: "register",
    canActivate: [GuardPreventGusetPageRender],
    component: RegisterComponent
  },
  {
    path: "profile",
    component: ProfilComponent
  },
  {
    path: "logout",
    component: LogoutComponent
  },
  {
    path: "**",
    component: WallComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
