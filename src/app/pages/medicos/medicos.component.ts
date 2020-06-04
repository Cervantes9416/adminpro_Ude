import { Component, OnInit } from '@angular/core';
import { MedicoService } from '../../services/services.index';
import { Medico } from '../../models/medico.model';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos : Medico[] = [];
  total : number = 0;

  constructor(
    public _medicoService:MedicoService
  ) { }

  ngOnInit(): void {
    this.total = this._medicoService.totalMedicos;
    this._medicoService.cargarMedicos()
                       .subscribe(resp => this.medicos = resp);
  }

  cargarMedicos(){
    this._medicoService.cargarMedicos()
                       .subscribe(resp => this.medicos = resp);
  }

  buscarMedico(termino:string){
    if(termino.length <= 0){
      this.cargarMedicos();
      return;
    }

    this._medicoService.buscarMedico(termino)
                       .subscribe((resp:any)=>{
                        this.medicos = resp;
                       });

  }

  borrarMedico(_id:string){
    this._medicoService.borrarMedico(_id)
                       .subscribe(resp => {
                         this.cargarMedicos();
                       });
  }
}
