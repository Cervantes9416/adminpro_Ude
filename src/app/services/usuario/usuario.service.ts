import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';

import { retry, map, filter, catchError} from 'rxjs/operators';


import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  usuario:Usuario;
  token:string;
  menu:any = [];

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
      this.menu = JSON.parse(localStorage.getItem('menu'));
    }else{
      this.token = '';
      this.usuario = null;
      this._router.navigate(['/login']);
      this.menu = [];
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
                        this.guardarStorage(resp.usuarioDB._id, resp.token, resp.usuarioDB,resp.menu)
                      }),
                      catchError((err:any) => {
                        Swal.fire('Error en el login',err.error.message,'error');
                        return Observable.throw(err);
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
    localStorage.removeItem('menu');
    this._router.navigate(['/login']);
  }

  // ====================================================
  // INICIAR SESION CON GOOGLE
  // ====================================================
  loginGoogle(token:string){
    let URL = URL_SERVICIOS + '/login/google';

    return this.http.post(URL,{token:token})
                    .pipe(
                      map((resp:any)=> {
                        this.guardarStorage(resp.usuarioDB._id, resp.token, resp.usuarioDB,resp.menu);
                        return true;
                      }),
                      catchError((err:any)=>{
                        console.log(err.status);
                        return Observable.throw(err);
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
        if(usuario._id === this.usuario._id){
          let usuarioDB:Usuario = resp.usuario;
          this.guardarStorage(usuarioDB._id,this.token,usuarioDB,this.menu)
        }

        Swal.fire('Usuario actualizado',usuario.nombre.toString(),'success')
        return true;
      })
    )
  }

  // ====================================================
  // GUARDAR VALORES EN EL LOCALSTORAGE
  // ====================================================
  guardarStorage(id: string, token: string, usuario: Usuario,menu:any) {
    localStorage.setItem('id', id);
    localStorage.setItem('TOKEN', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu',JSON.stringify(menu));
    this.token = token;
    this.usuario = usuario;
    this.menu = menu;
  }

  // ====================================================
  // CAMBIAR IMAGEN
  // ====================================================
  async cambiarImagen(file:File, id:string){
    try {
      let res:any = await this._subirArchivoService.subirArchivo(file,'usuarios',id); 
      this.usuario.img = res.usuario.img;
      Swal.fire('Imagen actualizada',this.usuario.nombre.toString(),'success');
      this.guardarStorage(id,this.token,this.usuario,this.menu);

    } catch (error) {
      console.log(error);
    }
  }

  // ====================================================
  // OBTENER TODOS LOS USUARIOS
  // ====================================================
  cargarUsuarios(desde:number = 0){
    let URL = `${URL_SERVICIOS}/usuario?desde=${desde}`;

    return this.http.get(URL);
  }

  // ====================================================
  // BUSCAR USUARIO
  // ====================================================
  buscarUsuarios(termino:string){
    let URL = `${URL_SERVICIOS}/busqueda/coleccion/usuario/${termino}`;

    return this.http.get(URL)
      .pipe(
        map((resp:any) => {
          return resp.respuesta
        })
      )
  }

  // ====================================================
  // BORRAR UN USUARIO
  // ====================================================
  borrarUsuario(_id:string){
    let URL = `${URL_SERVICIOS}/usuario/${_id}`;

    const headersData = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': this.token,
    });

    return this.http.delete(URL, {headers:headersData})
      .pipe(
        map((resp:any) => {
          Swal.fire(
            'Eliminado!',
            `El usuario ${resp.usuario.nombre} ha sido eliminado`,
            'success'
          );
        })
      );
  }
}
