import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/services.index';
import Swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios:Usuario[]    = [];
  desde:number          = 0;
  totalRegistros:number = 0
  cargando:boolean = true;
  
  constructor(
    public _usuarioService:UsuarioService,
    public _modalUploadService:ModalUploadService,
  ) { }

  ngOnInit(): void {
    this.cargarUsuarios();
    this._modalUploadService.notificacion
                            .subscribe(res => {
                              this.cargarUsuarios();
                            });
  }

  cargarUsuarios(){
    this.cargando = true;
    this._usuarioService.cargarUsuarios(this.desde)
                        .subscribe((resp:any) => {
                          this.usuarios = resp.usuarios;
                          this.totalRegistros = resp.total;
                          this.cargando = false;
                        });
  }

  cambiarDesde(valor:number){
    let desde = this.desde + valor;
    if(desde >= this.totalRegistros){
      return;
    }

    if(desde < 0){
      return;
    }

    this.desde += valor;
    this.cargarUsuarios();
  }

  buscarUsuario(termino:string){
    if(termino.length <= 0){
      this.cargarUsuarios();
      return;
    }

    this.cargando = true;

    this._usuarioService.buscarUsuarios(termino)
                        .subscribe(resp => {
                          this.usuarios = resp;
                          this.cargando = false;
                        })
  }

  async borrarUsuario(_id:string){
    if(_id === this._usuarioService.usuario._id){
      Swal.fire('Cuidado','No es posible borrar este usuario','warning');
      return;
    }

    let result = await Swal.fire({
      title: '¿Esta seguto?',
      text: "Esta apunto de eliminar este usuario",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'No, Cancelar!',
      reverseButtons: true
    });

    if(result.value){
      this._usuarioService.borrarUsuario(_id)
                        .subscribe(resp => this.cargarUsuarios());
    }
  }


  guardarUsuario(usuario:Usuario){
    this._usuarioService.actualizarUsuario(usuario)
                        .subscribe(resp => this.cargarUsuarios())
  }

  mostrarModal(_id:string){
    this._modalUploadService.mostrarModal('usuarios',_id);
  }
}
