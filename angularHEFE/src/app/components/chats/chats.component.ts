import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ChatsService } from '../../services/chats.service';
import {Room} from '../../models/room';
@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css'],
  providers: [UserService, ChatsService]

})
export class ChatsComponent implements OnInit {

  public user: any;
  public rooms: Room[];
  public selector:any;

  constructor(public _userService: UserService, public _chatsService:ChatsService) { }

  async ngOnInit(): Promise<void> {
    this.selector='empty';
    const user = await this._userService.getCurrentUser();
    this._userService.getUserData(user.uid).subscribe(datauser => {
      this.user = datauser;
      this._chatsService.getRooms(datauser).subscribe(rooms =>{
        this.rooms = rooms;
        //console.log(rooms);
      });
    });

  }

  mostrarChat(event){
    this.selector = event.chat;
     console.log(event.selector);
    
    //console.log(this.favorita.title);        
  }
}
