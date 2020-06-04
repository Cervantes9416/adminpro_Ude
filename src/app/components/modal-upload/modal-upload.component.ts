import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Usuario } from '../../models/usuario.model';
import { SubirArchivoService } from 'src/app/services/services.index';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {
  imagenSubida:File;
  imagenTemp:any;

  constructor(
    public _subirArchivoService:SubirArchivoService,
    public _modalUploadService:ModalUploadService,
  ) 
  { }

  ngOnInit(): void {
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

  async subirImagen(){
    try {
      let res:any = await this._subirArchivoService
                          .subirArchivo(
                            this.imagenSubida, 
                            this._modalUploadService.tipo, 
                            this._modalUploadService.id
                            );
                            console.log(res);
      this._modalUploadService.notificacion.emit(res.usuario);
      this.cerrarModal();
    } catch (error) {
      console.log(error);
      this.cerrarModal();
      Swal.fire('Error al subir archivo','','error');
    }
  }

  cerrarModal(){
    this.imagenSubida = null;
    this.imagenTemp = null;
    this._modalUploadService.ocultarModal();

    let element : any = document.getElementById('input-upload');
    element.value = null;
  }

}
