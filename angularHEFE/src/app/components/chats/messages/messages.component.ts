import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ChatsService } from '../../../services/chats.service'
import { Message } from '../../../models/message';
import * as moment from 'moment';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
  providers: [ChatsService]
})
export class MessagesComponent implements OnInit {

  @Input() message: any;
  @Input() room : any;
  @Input() uid: any;
  @Output() delete = new EventEmitter();
  @Output() reported = new EventEmitter();
  date: any;
  you: boolean;
  user: any;
  tipe: any;
  public messages: Message[];
  constructor(private ChatService: ChatsService) {

  }

  ngOnInit(): void {

    this.tipe = this.message.tipe;
    moment.locale('es')
    this.date = moment(this.message.date).calendar();  
    if(this.message.uid == this.uid){
      this.you = true;
      this.user = '';
    }else{
      this.you = false;
      this.ChatService.getUserMsg(this.message.uid).subscribe(data => {
        this.user = data;
      })
    }


  }

  reportMsg(msg, id, email) {
    //console.log('Reportado => ' + msg);
    this.reported.emit({reported: msg, id: id, email: email})
  }

  deleteMsg(id) {
    //console.log('Eliminado =>' + id);
    this.delete.emit({ delete: id});

  }

  verImagen(image, message, user){
    if(!this.user){user = 'Tu'}
    Swal.fire({
      text: `${user}:  ${message}`,
      imageUrl: image,

      imageAlt: 'Custom image',
    })
  }

}