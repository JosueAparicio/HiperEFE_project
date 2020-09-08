import { Component, OnInit, Input } from '@angular/core';
import { RoomsService } from '../../services/rooms.service';
import { Room } from '../../models/room';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sala',
  templateUrl: './sala.component.html',
  styleUrls: ['./sala.component.css']
})
export class SalaComponent implements OnInit {

  @Input() room: Room;
  constructor(
    public roomServices: RoomsService,
    public _router: Router
  ) {}

  ngOnInit(): void {
  }

  detailsRoom(): void{
    this.roomServices.getCreatorRoom(this.room.id).then((creator) =>{
      this._router.navigate(['detailsRoom',creator.data().uidCreador, this.room.id]);
    })
  }

}
