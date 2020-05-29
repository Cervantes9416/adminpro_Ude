import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/usuario/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';

declare function init_plugins();
declare const gapi:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  recuerdame: boolean = false;
  email:string;
  auth2:any;

  constructor(
    private ngZone: NgZone,
    private _usuarioService : UsuarioService,
    public router:Router
    ) 
    { }

  ngOnInit(): void {
    init_plugins();
    this.googleInit();
    this.email = localStorage.getItem('email') || '';
    if(this.email.length > 1){
      this.recuerdame = true;
    }
  }

  ingresar(forma:NgForm){
    if(forma.invalid){
      return;
    }

    let usuario = new Usuario(null,forma.value.email, forma.value.password)
    this._usuarioService.login(usuario, forma.value.recuerdame)
                        .subscribe(res => this.router.navigate(['/dashboard']));
  }//ingresar()

  googleInit(){
    gapi.load('auth2',() => {
      this.auth2 = gapi.auth2.init({
        client_id:'943899923166-kmisvotebh3d5673gmtdjao7i8ld6cut.apps.googleusercontent.com',
        cookiepolicy:'single_host_origin',
        scope:'profile email'
      });
      this.attachSignIn(document.getElementById('btnGoogle'));
    });
  }//googleIntit()

  attachSignIn(element){
    this.auth2.attachClickHandler(element,{},(googleUser) => {
      //let profile = googleUser.getBasicProfile();
      let token = googleUser.getAuthResponse().id_token;
      this._usuarioService.loginGoogle(token)
                          .subscribe(() => {
                            this.ngZone.run(() => this.router.navigate(['/dashboard'])).then();
                          });

      //console.log(token);
    });
  }
}
