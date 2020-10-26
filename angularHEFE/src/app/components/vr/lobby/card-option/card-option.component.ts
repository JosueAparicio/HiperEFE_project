import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-option',
  templateUrl: './card-option.component.html',
  styleUrls: ['./card-option.component.css']
})
export class CardOptionComponent implements OnInit {

  
  constructor() { }

  ngOnInit(): void {
    console.log('CARD OPTION CARGADO');
    
  }

}
