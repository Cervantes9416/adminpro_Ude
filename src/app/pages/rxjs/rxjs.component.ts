import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { retry, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  constructor() { 
    this.subscription = this.regresaObservable()
    .subscribe(
      numero => console.log('Sub',numero),
      error => console.error('Error en el obs',error),
      () => console.log('El observador termino!')
    );
  }
  ngOnDestroy(): void {
    console.log('La pagina se va a cerrar!');
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
  }

  regresaObservable():Observable<any>{
    return new Observable(observer => {
      
      let contador = 0;
      let intervalor = setInterval(() => {
        
        contador+=1;

        const salida = {
          valor:contador,
        }

        observer.next(salida);

        // if(contador === 3){
        //   clearInterval(intervalor);
        //   observer.complete();
        // }
      },1000);
    }).pipe(
      map( resp => resp.valor),
      filter((valor, index) => {
        //console.log('Filter',valor,index)
        if((valor % 2) === 1){
          return true;
        }else{
          return false;
        }
      })
    );
  }

}
