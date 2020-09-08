import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ChatsService } from '../../../services/chats.service';
import { Message } from '../../../models/message';
import * as moment from 'moment';


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
  date: any;
  @Output() chatSelect = new EventEmitter();

  constructor(private chatService: ChatsService) { }

  ngOnInit(): void {
    moment.locale('es')

    this.chatService.getLastMessage(this.conversation.id).subscribe(msg => {
      //console.log(msg)
      if (msg) {

        msg.map(row => {
          this.chatService.getUserMsg(row.uid).subscribe(p => {
            this.user = p;
            this.message = row;
            this.date =  moment(row.date).fromNow(); 
            //console.log(p, row);

          });
        });



      }


    });
  }

  seleccionar(event, selector) {

    this.chatSelect.emit({
      conversation: selector
    });

  }
}
