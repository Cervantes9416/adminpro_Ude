import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: []
})
export class IncrementadorComponent implements OnInit {
  @ViewChild('txtProgress') txtProgress: ElementRef;

  //INPUT FUNCIONA COMO EL PARAMETER DE BLAZOR
  @Input('nombre') leyenda:string = 'Leyenda Test';
  @Input() porcentaje:number = 50;

  //OUTPUT - SIMILAR AL EVENTCALLBACK<> DE BLAZOR
  @Output() cambioValor:EventEmitter<number> = new EventEmitter();

  constructor() { 
  }

  ngOnInit(): void {
  }

  cambiarValor(valor:number){
    if(this.porcentaje >= 100 && valor > 0){
      this.porcentaje = 100;
      return;
    }
    if(this.porcentaje <= 0)  return;
    this.porcentaje += valor;

    //EQUVALENTE A metodo.invokeAsync(valor);
    this.cambioValor.emit(this.porcentaje);
  }

  OnChanges(event:number){
    //let elementoHTML:any = document.getElementsByName('porcentaje')[0];
    

    if(event > 100){
      this.porcentaje = 100;
    }else if(event < 0){
      this.porcentaje = 0;
    }

    //elementoHTML.value = Number(this.porcentaje);
    this.txtProgress.nativeElement.value = this.porcentaje;

    this.cambioValor.emit(this.porcentaje);
  }
}
