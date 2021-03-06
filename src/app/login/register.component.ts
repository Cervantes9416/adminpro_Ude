import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// import * as _swal from 'sweetalert';
// import { SweetAlert } from 'sweetalert/typings/core';
// const swal: SweetAlert = _swal as any;

import Swal from 'sweetalert2';

import { UsuarioService } from '../services/services.index';
import { Usuario } from 'src/app/models/usuario.model';
import { Router } from '@angular/router';

declare function init_plugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css']
})
export class RegisterComponent implements OnInit {

  forma:any;

  constructor(
    private _usuarioService:UsuarioService,
    public _router:Router,
  ) { }

  sonIguales(campo1:any, campo2:any){
    return (group:FormGroup) => {
      
      let pass1 = group.controls[campo1].value;
      let pass2 = group.controls[campo2].value;

      if(pass1 === pass2){
        return null;
      }

      return{
        sonIguales:true
      }
    }
  }

  ngOnInit(): void {
    init_plugins();

    this.forma = new FormGroup({
      nombre:new FormControl(null, Validators.required),
      correo:new FormControl(null, [Validators.required, Validators.email]),
      password:new FormControl(null, [Validators.required]),
      password2:new FormControl(null, Validators.required),
      condiciones: new FormControl(false)
    },
      {
        validators:this.sonIguales('password','password2')
      }
    );
  }

  registrarUsuario(){

    if(this.forma.invalid){
      return;
    }

    if(!this.forma.value.condiciones){
      //swal("Importante!", "Debe de aceptar las condiciones", "warning");
      Swal.fire("Importante!", "Debe de aceptar las condiciones", "warning");
      return;
    }

    let usuario = new Usuario(
      this.forma.value.nombre,
      this.forma.value.correo,
      this.forma.value.password
    );

    this._usuarioService.crearUsuario(usuario)
      .subscribe(resp => this._router.navigate(['/login']));
  }
}
