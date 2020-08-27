import { Component, OnInit, Input } from '@angular/core';
import { Topic } from '../../models/topics';
@Component({
  selector: 'app-sala',
  templateUrl: './sala.component.html',
  styleUrls: ['./sala.component.css']
})
export class SalaComponent implements OnInit {
  @Input() topic: Topic;
  constructor() { }

  ngOnInit(): void {
  }

}
