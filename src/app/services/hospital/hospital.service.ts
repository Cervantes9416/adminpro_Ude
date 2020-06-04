import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import { Hospital } from '../../models/hospital.model';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../usuario/usuario.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(
    public http : HttpClient,
    public _usuarioStorage:UsuarioService,
  ) { }

  // ====================================================
  // OBTENER TODOS LOS HOSPITALES
  // ====================================================
  cargarHospitales(){
    let URL = `${URL_SERVICIOS}/hospital`

    return this.http.get(URL)
                    .pipe(
                      map((resp:any)=>{
                        return resp.hospitales
                      })
                    )
  }

  // ====================================================
  // OBTENER UN HOSPITAL
  // ====================================================
  obtenerHospital(_id:string){
    let URL = `${URL_SERVICIOS}/hospital/${_id}`;

    return this.http.get(URL);
  }

  // ====================================================
  // CREAR UN HOSPITAL
  // ====================================================
  crearHospital(hospital:Hospital){
    let URL = `${URL_SERVICIOS}/hospital`;

    const headersData = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': this._usuarioStorage.token,
    });

    return this.http.post(URL,hospital,{headers:headersData});
  }

  // ====================================================
  // ELIMINAR UN HOSPITAL
  // ====================================================
  borrarHospital(_id:string){
    let URL = `${URL_SERVICIOS}/hospital/${_id}`;

    const headersData = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': this._usuarioStorage.token,
    });

    return this.http.delete(URL,{headers:headersData});
  }

  // ====================================================
  // ACTUALIZAR HOSPITAL
  // ====================================================
  actualizarHospital(hospital:Hospital){
    let URL = `${URL_SERVICIOS}/hospital/${hospital._id}`

    const headersData = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': this._usuarioStorage.token,
    });

    return this.http.put(URL,hospital,{headers:headersData})
                    .pipe(
                      map((res:any)=>{
                        Swal.fire('Usuario actualizado',hospital.nombre.toString(),'success')
                        return true;
                      })
                    );
  }

  // ====================================================
  // BUSCAR UN HOSPITAL
  // ====================================================
  buscarHospital(termino:string){
    let URL = `${URL_SERVICIOS}/busqueda/coleccion/hospital/${termino}`;

     return this.http.get(URL).pipe(map((resp:any) => resp.respuesta));
  }

}
