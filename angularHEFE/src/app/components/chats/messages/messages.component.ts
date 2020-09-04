import { Component, OnInit, Input } from '@angular/core';
import { ChatsService } from '../../../services/chats.service'
import { Message } from '../../../models/message';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
  providers: [ChatsService]
})
export class MessagesComponent implements OnInit {

  @Input() message: any;
  @Input() uid: any;
  you: boolean;
  public messages: Message[];
  constructor(private ChatService: ChatsService) {

  }

  ngOnInit(): void {

    //console.log(this.uid);
    
    if(this.message.uid == this.uid){
      this.you = true;
    }else{
      this.you = false;
    }
  }

  reportMsg(msg) {
    console.log('Reportado =>' + msg);
  }

  deleteMsg(msg) {
    console.log('Eliminado =>' + msg);
  }

  editMsg(msg) {
    console.log('Editado =>' + msg);
  }
}