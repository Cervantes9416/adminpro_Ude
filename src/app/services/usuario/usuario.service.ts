import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';

import { retry, map, filter } from 'rxjs/operators';

import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  usuario:Usuario;
  token:string;

  constructor(
    private _router:Router,
    public http:HttpClient,
    public _subirArchivoService:SubirArchivoService) 
  { 
    this.cargarStorage();
  }
  
  // ====================================================
  // VALIDAR SI EL USUARIO ESTA LOGUEADO
  // ====================================================
  estaLogueado(){
    return(this.token.length > 5) ? true : false;
  }

  // ====================================================
  // CARGAR VALORES EN EL LOCALSTORAGE
  // ====================================================
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

  // ====================================================
  // CREAR UN NUEVO USUARIO
  // ====================================================
  crearUsuario(usuario:Usuario){
    let URL = URL_SERVICIOS + '/usuario';
    return this.http.post(URL,usuario)
      .pipe(
        map((resp:any) => {
          Swal.fire('Usuario creado',usuario.email.toString(),'success')
          return resp.usuario
        })
      )
  }//crearUsuario()

  // ====================================================
  // INICIAR SESION 
  // ====================================================
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

  // ====================================================
  // CERRRAR SESION
  // ====================================================
  logout(){
    this.usuario = null;
    this.token = '';

    localStorage.removeItem('TOKEN'),
    localStorage.removeItem('usuario'),
    localStorage.removeItem('id');
    window.location.reload();
  }

  // ====================================================
  // INICIAR SESION CON GOOGLE
  // ====================================================
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

  // ====================================================
  // ACTUALIZAR USUARIO
  // ====================================================
  actualizarUsuario(usuario:Usuario){
    let URL = `${URL_SERVICIOS}/usuario/${usuario._id}`;

    const headersData = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': this.token,
    });

    return this.http.put(URL,usuario,{headers:headersData})
    .pipe(
      map((resp:any)=> {
        Swal.fire('Usuario actualziado',usuario.nombre.toString(),'success')
        this.guardarStorage(resp.usuario._id,this.token,resp.usuario)
        return true;
      })
    )
  }

  // ====================================================
  // GUARDAR VALORES EN EL LOCALSTORAGE
  // ====================================================
  guardarStorage(id: string, token: string, usuario: Usuario) {
    localStorage.setItem('id', id);
    localStorage.setItem('TOKEN', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.token = token;
    this.usuario = usuario;
  }

  // ====================================================
  // CAMBIAR IMAGEN
  // ====================================================
  async cambiarImagen(file:File, id:string){
    try {
      let res:any = await this._subirArchivoService.subirArchivo(file,'usuarios',id); 
      this.usuario.img = res.usuario.img;
      Swal.fire('Imagen actualizada',this.usuario.nombre.toString(),'success');
      this.guardarStorage(id,this.token,this.usuario);

    } catch (error) {
      console.log(error);
    }
  }
}
