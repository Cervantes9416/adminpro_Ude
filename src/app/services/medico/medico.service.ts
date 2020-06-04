import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../usuario/usuario.service';
import Swal from 'sweetalert2';
import { Medico } from '../../models/medico.model';
import { ThrowStmt } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  totalMedicos:number = 0;

  constructor(
    public http:HttpClient,
    public _usuarioService:UsuarioService
  ) { }

  // ====================================================
  // OBTENER TODOS LOS MEDICOS
  // ====================================================
  cargarMedicos(){
    let URL = `${URL_SERVICIOS}/medico`;

    return this.http.get(URL)
      .pipe(
        map((resp:any)=>{
          this.totalMedicos = resp.total;
          console.log(resp.medicos);
          return resp.medicos;
        })
      )
  }

  // ====================================================
  // OBTENER UN MEDICO
  // ====================================================
  obtenerMedico(_id:string){
    let URL = `${URL_SERVICIOS}/medico/${_id}`;
    
    return this.http.get(URL)
      .pipe(
        map((resp:any) => {
          return resp.medico;
        })
      )
  }

  // ====================================================
  // BUSCAR UN MEDICO
  // ====================================================
  buscarMedico(termino:string){
    let URL = `${URL_SERVICIOS}/busqueda/coleccion/medico/${termino}`;

    return this.http.get(URL)
      .pipe(
        map((resp:any) => {
          return resp.respuesta;
        })
      )
  }

  // ====================================================
  // BORRRAR MEDICO
  // ====================================================
  borrarMedico(_id:string){
    let URL = `${URL_SERVICIOS}/medico/${_id}`;

    const headersData = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': this._usuarioService.token,
    });

    return this.http.delete(URL,{headers:headersData})
      .pipe(
        map((resp : any)=>{
          Swal.fire('Medico borrado','Medico borrado correctamente','success')
          return resp;
        })
      )
  }

  // ====================================================
  // CREAR UN MEDICO
  // ====================================================
  crearMedico(medico:Medico){
    let URL = `${URL_SERVICIOS}/medico`

    const headersData = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': this._usuarioService.token,
    });

    if(medico._id){
      URL += `/${medico._id}`;
      return this.http.put(URL,medico,{headers:headersData})
        .pipe(
          map((resp:any) => {
            Swal.fire('Medico actualizado',`El medico ${medico.nombre} se ha actualizado`,'success');
            return resp.medico;
          })
        );
    }else{
      return this.http.post(URL,medico,{headers:headersData})
        .pipe(
          map((resp:any)=>{
            Swal.fire('Medico creado',`El medico ${resp.medico.nombre} se ha creado`,'success');
            return resp.medico;
          })
        );
    }
  }

  // ====================================================
  // ACTUALZAR MEDICO
  // ====================================================


}
