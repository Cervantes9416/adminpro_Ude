import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/services.index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {

  usuario:Usuario;
  imagenSubida:File;
  imagenTemp:any;

  constructor(
    public _usuarioService:UsuarioService
  ) { }

  ngOnInit(): void {
    this.usuario = this._usuarioService.usuario;
  }

  actualizarUsuario(usuario:Usuario){
    this.usuario.nombre = usuario.nombre;
    if(!this.usuario.google){
      this.usuario.email  = usuario.email;
    }

    this._usuarioService.actualizarUsuario(this.usuario)
                        .subscribe();
  }

  seleccionImagen(event){
    let file:File = event.target.files[0];

    if(!file){
      this.imagenSubida = null;
      return;
    }

    if(file.type.indexOf('image') < 0){
      Swal.fire('Solo imagenes','El archivo no es una imagen','warning');
      this.imagenSubida = null;
      return;
    }
    
    this.imagenSubida = file;

    let reader = new FileReader();
    let urlImagenTemp = reader.readAsDataURL(file);
    reader.onloadend = ()=> this.imagenTemp = reader.result;
  }

  cambiarImagen(){
    this._usuarioService.cambiarImagen(this.imagenSubida,this.usuario._id.toString())
  }
}
