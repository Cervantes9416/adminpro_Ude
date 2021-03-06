import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class SubirArchivoService {

  constructor() { }

  // ====================================================
  // SUBIR UN ARCHIVO
  // ====================================================
  subirArchivo(archivo: File, tipo: string, id: string) {

    return new Promise((resolve, reject) => {
      let formData = new FormData();
      let xhr = new XMLHttpRequest();

      formData.append('img', archivo, archivo.name);

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            console.log('Imagen Subida');
            resolve(JSON.parse(xhr.response));
          }else{
            console.log('Fallo la subida');
            reject(xhr.response);
          }
        }
      }

      let URL = URL_SERVICIOS + '/upload/' + tipo + '/'  + id

      xhr.open('PUT',URL,true);
      xhr.send(formData);

    });//PROMESA()
  }//subirArchivo()



}
