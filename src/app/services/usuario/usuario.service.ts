import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';

import { retry, map, filter } from 'rxjs/operators';

import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
import { Router } from '@angular/router';
const swal: SweetAlert = _swal as any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  usuario:Usuario;
  token:string;

  constructor(
    private _router:Router,
    public http:HttpClient) 
  { 
    this.cargarStorage();
  }
  
  estaLogueado(){
    return(this.token.length > 5) ? true : false;
  }

  cargarStorage(){
    if(localStorage.getItem('TOKEN')){
      this.token = localStorage.getItem('TOKEN');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    }else{
      this.token = '';
      this.usuario = null;
      this._router.navigate(['/login']);
    }
  }

  crearUsuario(usuario:Usuario){
    let URL = URL_SERVICIOS + '/usuario';
    return this.http.post(URL,usuario)
      .pipe(
        map((resp:any) => {
          swal('Usuario creado',usuario.email.toString(),'success')
          return resp.usuario
        })
      )
  }//crearUsuario()

  login(usuario:Usuario, recordar:boolean){
    let URL = URL_SERVICIOS + '/login';
    
    if(recordar){
      localStorage.setItem('email',usuario.email.toString())
    }else{
      localStorage.removeItem('email');
    }

    return this.http.post(URL, usuario)
                    .pipe(
                      map((resp:any) => {
                        this.guardarStorage(resp.usuarioDB._id, resp.token, resp.usuarioDB)
                        return true;
                      })
                    )
  }//login()

  logout(){
    this.usuario = null;
    this.token = '';

    localStorage.removeItem('TOKEN'),
    localStorage.removeItem('usuario'),
    localStorage.removeItem('id');
    window.location.reload();
  }

  loginGoogle(token:string){
    let URL = URL_SERVICIOS + '/login/google';

    return this.http.post(URL,{token:token})
                    .pipe(
                      map((resp:any)=> {
                        this.guardarStorage(resp.usuarioDB._id, resp.token, resp.usuarioDB);
                        return true;
                      })
                    );
  }

  guardarStorage(id: string, token: string, usuario: Usuario) {
    localStorage.setItem('id', id);
    localStorage.setItem('TOKEN', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.token = token;
    this.usuario = usuario;
  }
}
