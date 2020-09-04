import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ChatsService } from '../../services/chats.service';
import { Room } from '../../models/room';
import { Message } from '../../models/message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css'],
  providers: [UserService, ChatsService]

})
export class ChatsComponent implements OnInit {

  public user: any;
  public rooms: Room[];
  public conversation: any;
  public messages: Message[];
  msgForm: FormGroup;

  constructor(public _userService: UserService, public _chatsService: ChatsService, private _formBuilder: FormBuilder) { }

  async ngOnInit(): Promise<void> {

    this.conversation = 'Empty';
    this.msgForm = this._formBuilder.group({
      msg: ['', Validators.required]
    });
    
    const user = await this._userService.getCurrentUser();
    this._userService.getUserData(user.uid).subscribe(datauser => {
      this.user = datauser;
      this._chatsService.getRooms(datauser).subscribe(rooms => {
        this.rooms = rooms;
        //console.log(rooms);
      });
    });
    
  }
  mmm() {
    this.messages =[];
    var cont = 0;
    var newMessages = [];
    var user: any;
    this._chatsService.getFullMessages(this.conversation.id).subscribe(msgs => {
      //console.log(msgs);
      msgs.forEach(row => {
        //console.log(row);
        this._chatsService.getUserMsg(row.uid).subscribe(data => {
          //console.log(data.displayName);
          user = data;
          newMessages[cont] = {
            message: row.message,
            date: row.date,
            uid: row.uid,
            displayName: user.displayName,
            photoURL: user.photoURL
          }
          cont++;

        });
        //console.log(cont);
      })
      this.messages = newMessages;
      console.log(this.messages);
    })
  }
   mostrarChat(event) {
    //console.log(event.conversation.id);
    
    if(event.conversation.id == this.conversation.id){
      return
    }
    this.conversation = event.conversation;
    this.mmm()

  }

  send(){
    if(this.msgForm.invalid || this.conversation == 'Empty'){
      console.log('neeh');
      return;
    }
    var newMsg = {
      uid: this.user.uid,
      message: this.msgForm.value.msg,
      date: Date.now()
    }

    //console.log(newMsg);
    
    this._chatsService.sendMessage(newMsg, this.conversation.id);
  }


}
