import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string, tipo: string = 'usuario'): unknown {
    let url = URL_SERVICIOS + '/img';

    if(!img){
      return url + '/usurios/xxx';
    }

    if(img.indexOf('https') >= 0){
      return img;
    }

    switch (tipo) {
      case 'usuario':
        url += '/usuarios/' + img;
        break;
      case 'medicos':
        url += '/medicos/' + img;
        break;
      case 'hospitales':
        url += '/hospitales/' + img;
        break;
      default:
        console.log('Tipo de imagen no existe');
        url += '/usurios/xxx';
    }
    
    return url;
  }

}
