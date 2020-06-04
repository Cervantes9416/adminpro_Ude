import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/services.index';
import Swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { URL_SERVICIOS } from 'src/app/config/config';

@Component({
  selector: 'app-hospital',
  templateUrl: './hospital.component.html',
  styles: []
})
export class HospitalComponent implements OnInit {

  cargando:boolean = true;
  desde:number = 0;
  hospitales:Hospital[] = [];
  
  constructor(
    public _hospitalService:HospitalService,
    public _modalUpdateService:ModalUploadService,
  ) { }

  ngOnInit(): void {
    this.cargarHospitales();
    this._modalUpdateService.notificacion
                            .subscribe(res => {
                              this.cargarHospitales();
                            })
  }

  // ====================================================
  // CRUD HOSPITALES
  // ====================================================
  cargarHospitales(){
    this.cargando = true;
    this._hospitalService.cargarHospitales()
                         .subscribe(res => {
                           this.hospitales = res;
                           this.cargando = false;
                         })
  }
  
  // ====================================================
  // CREAR UN NUEVO HOSPITAL
  // ====================================================
  async crearHospital(){
    try {
      
    } catch (error) {
      
    }
    
    let result = await Swal.fire({
      title: 'Ingrese nombre del hospital',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Crear hospital',
      cancelButtonText:'Cancelar',
      showLoaderOnConfirm: true,
    });

    if(!result.isConfirmed) return;

    let nombreHospital:any = result.value;

    if(nombreHospital.length <= 0){
      Swal.fire('Error','Es necesario ingresar un dato','error');
      return;
    }

    let hospital = new Hospital(nombreHospital);
    this._hospitalService.crearHospital(hospital)
                         .subscribe(resp => {
                           this.cargarHospitales();
                         })
  }

  // ====================================================
  // BORRAR UN NUEVO HOSPITAL
  // ====================================================
  async borrarHospital(_id:string){
    
    let result = await Swal.fire({
      title: '¿Esta seguto?',
      text: "Esta apunto de eliminar este usuario",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'No, Cancelar!',
      reverseButtons: true
    });

    if(!result.value) return;

    this._hospitalService.borrarHospital(_id)
                         .subscribe(resp => {
                           this.cargarHospitales();
                         })
  }

  // ====================================================
  // ACTUALIZAR UN HOSPITAL
  // ====================================================
  actualizarHospital(hospital:Hospital){
    this._hospitalService.actualizarHospital(hospital)
                         .subscribe(resp => this.cargarHospitales());
  }

  // ====================================================
  // BUSCAR UN HOSPITAL
  // ====================================================
  buscarHospital(termino:string){
    if(termino.length <= 0){
      this.cargarHospitales();
      return;
    }
    this._hospitalService.buscarHospital(termino)
                         .subscribe(resp => this.hospitales = resp );
  }


  // ====================================================
  // METODOS MODAL
  // ====================================================
  mostrarModal(_id:string){
    this._modalUpdateService.mostrarModal('hospitales',_id);
  }
}
