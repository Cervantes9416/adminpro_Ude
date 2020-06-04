import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { NgForm } from '@angular/forms';
import { MedicoService, HospitalService } from 'src/app/services/services.index';
import { Hospital } from '../../models/hospital.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {

  medico:Medico;
  hospitales:Hospital[] = [];
  hospital:Hospital = new Hospital('');

  constructor(
    public _medicoService:MedicoService,
    public _hospitalService:HospitalService,
    public _route:Router,
    public activatedRouter:ActivatedRoute,
    public _modalUploadService:ModalUploadService
  ) 
  {
    this.medico = new Medico('','','','','');
    this.activatedRouter.params.subscribe((params:any) => {
      let _id = params['id'];
      if(_id !== 'nuevo'){
        this.cargarMedico(_id);
      }
    })
  }

  ngOnInit(): void {
    this._hospitalService.cargarHospitales()
                         .subscribe(resp => this.hospitales = resp );
    this._modalUploadService.notificacion
      .subscribe((resp:any) => {
        this.medico.img = resp.img;
      });
    
  }

  cargarMedico(_id:string){
    this._medicoService.obtenerMedico(_id)
                       .subscribe((resp:any) => {
                         this.medico = resp;
                         this.medico.hospital = resp.hospital._id;
                         this.cambioHospital(this.medico.hospital)
                       })
  }

  guardarMedico(forma:NgForm){
    if(!forma.valid){
      return;
    }

    this._medicoService.crearMedico(this.medico)  
                       .subscribe(resp => {
                         this.medico._id = resp._id;
                         this._route.navigate(['/medico',resp._id]);
                       });
  }

  cambioHospital(value:string){
    if(value.length <= 0){
      return;
    }

    this._hospitalService.obtenerHospital(value)
                         .subscribe((resp:any) => {
                           this.hospital = resp.hospital;
                         });
  }

  cambiarFoto(){
    this._modalUploadService.mostrarModal('medicos',this.medico._id);
  }
}
