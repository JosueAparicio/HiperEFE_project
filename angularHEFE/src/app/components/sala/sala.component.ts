import { Component, OnInit, Input } from '@angular/core';
import { Room } from '../../models/room';
@Component({
  selector: 'app-sala',
  templateUrl: './sala.component.html',
  styleUrls: ['./sala.component.css']
})
export class SalaComponent implements OnInit {

  @Input() room: Room;
  constructor() { }

  ngOnInit(): void {
  }

}
