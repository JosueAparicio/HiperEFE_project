import { Component, OnInit, Input } from '@angular/core';
import { ChatsService } from '../../../services/chats.service';
import { Message } from '../../../models/message';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.css'],
  providers: [ChatsService]
})
export class ConversationsComponent implements OnInit {

  @Input() conversation;
  message: any;
  user: any;
  constructor(private chatService: ChatsService ) {}

  ngOnInit(): void {
    this.chatService.getLastMessage(this.conversation.id).subscribe(msg =>{
        this.message = msg;
        console.log(msg);
        this.chatService.getUserMsg(msg[0].uid).subscribe(p =>{
          this.user = p;
          console.log(p);
        });
    });
  }

}
