import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  @Input()  selector: any; 
  @Input()  user : any; 
  public mostrar: string;
  constructor() { 

  }

  ngOnInit(): void {

    console.log(this.user.uid);
    this.mostrar = this.selector;

}
}