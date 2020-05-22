import { Component, OnInit } from '@angular/core';
import { rejects } from 'assert';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: []
})
export class PromesasComponent implements OnInit {

  constructor() { 
    this.contarSegundos()
    .then(mensaje => {

    })
    .catch(error => {

    });
    
  }

  ngOnInit(): void {
  }

  contarSegundos():Promise<any>{
    let promesa = new Promise((resolve,reject)=>{
      let contador = 0;
      let intervalo = setInterval(() => {
        contador+=1;
        console.log(contador);
        if(contador === 3){
          resolve({mensaje:'TEST',type:true});
          clearInterval(intervalo);
        }
      },1000);
    });
    /*
    promesa.then((mensaje)=>{
      console.log('Teermino!', mensaje);
    }).catch(error => {
      console.log('Error en la prmesa');
    });
    */
    return promesa;
  }

}
