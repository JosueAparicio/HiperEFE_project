import { Component, OnInit, Input } from '@angular/core';
import { RoomsService } from '../../services/rooms.service';
import { Room } from '../../models/room';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-sala',
  templateUrl: './sala.component.html',
  styleUrls: ['./sala.component.css'],
  providers: [UserService, RoomsService]
})
export class SalaComponent implements OnInit {

  @Input() room: Room;
  @Input() current: string;
  private uidCreator: string;
  public numberMembers: number;
  public user: any;
  public userData: any;
  porcentaje: any
  widthh: string
  constructor(
    public _router: Router,
    public roomServices: RoomsService,
    public userService: UserService
  ) {}

  async ngOnInit(){
    this.user = await this.userService.getCurrentUser();
    this.userService.getUserData(this.user.uid).subscribe(data =>{
      this.userData = data;

      if(this.userData.cuenta=='Docente'){
        this.uidCreator = this.user.uid;
        this.getCollectionRoom();
      }else{
        this.roomServices.getCreatorRoom(this.room.id).then((creator) => {
          //console.log(creator.data());
          this.uidCreator = creator.data().uidCreador;
          this.getCollectionRoom();
        });
      }
    }); 
  }

  getCollectionRoom() {
    this.roomServices.getCollectionRoomAsync(this.uidCreator, this.room.id).subscribe(collection => {
      this.numberMembers = collection.length;
      this.porcentaje = (this.numberMembers / (this.room.maxParticipantes as any) * 100 ) ;
      this.widthh = `${this.porcentaje}%;`;
      
    });
  }

  detailsRoom(): void{  
    this._router.navigate([`detailsRoom/${this.uidCreator}/${this.room.id}`]);
  }

}
