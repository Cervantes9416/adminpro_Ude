import { Injectable } from '@angular/core';
import { CanActivate} from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardGuard implements CanActivate {
  
  constructor(
    private _usuarioService:UsuarioService)
  {}

  canActivate(){
    if(this._usuarioService.estaLogueado()){
      console.log('PASO POR EL LOGIN GUARD');
      return true;
    }else{
      console.log('BLOQUEADO POR EL GUARD');
      return false;
    }
  }
  
}
