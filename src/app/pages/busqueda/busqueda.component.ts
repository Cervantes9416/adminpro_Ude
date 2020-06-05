import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { Usuario } from '../../models/usuario.model';
import { Medico } from '../../models/medico.model';
import { Hospital } from '../../models/hospital.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: []
})
export class BusquedaComponent implements OnInit {

  termino:string;

  usuarios:Usuario[] = [];
  medicos:Medico[] = [];
  hospitales:Hospital[] = [];

  constructor(
    public activatedRoute:ActivatedRoute,
    public http:HttpClient,
  ) 
  { 
    activatedRoute.params
      .subscribe(params => {
        let termino = params['termino'];
        this.termino = termino;
        this.buscar();
      });
  }

  ngOnInit(): void {
  }

  buscar(){
    let URL = `${URL_SERVICIOS}/busqueda/todo/${this.termino}`;

    this.http.get(URL)
      .subscribe((resp:any) => {
        this.hospitales = resp.hospitales;
        this.medicos = resp.medicos;
        this.usuarios = resp.usuarios;
      });
  }
}
