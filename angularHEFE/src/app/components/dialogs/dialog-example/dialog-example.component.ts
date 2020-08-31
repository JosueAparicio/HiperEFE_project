import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dialog-example',
  templateUrl: './dialog-example.component.html',
  styleUrls: ['./dialog-example.component.css']
})
export class DialogExampleComponent implements OnInit {

  @Input() room;

  constructor() { }

  ngOnInit(): void {
  }

  onClose(){
    
  }
}
