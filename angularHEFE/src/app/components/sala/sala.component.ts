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
  private uidCreator: string;
  public numberMembers: number;
  constructor(
    public roomServices: RoomsService,
    public _router: Router
  ) {}

  async ngOnInit(){
    await this.roomServices.getCreatorRoom(this.room.id).then((creator) => {
      this.uidCreator = creator.data().uidCreador;
    });

    this.roomServices.getCollectionRoomAsync(this.uidCreator, this.room.id).subscribe(collection=>{
      this.numberMembers = collection.length;
    });
  }

  detailsRoom(): void{
    
    this._router.navigate(['detailsRoom',this.uidCreator, this.room.id]);
  }

}
