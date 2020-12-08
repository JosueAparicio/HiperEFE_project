import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ChatsService } from '../../../services/chats.service'
import { UserService } from '../../../services/user.service'

import { Message } from '../../../models/message';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
  providers: [ChatsService, UserService]
})
export class MessagesComponent implements OnInit {

  @Input() message: any;
  @Input() room : any;
  @Input() uid: any;
  @Output() delete = new EventEmitter();
  @Output() reported = new EventEmitter();
  @Output() reportedImg = new EventEmitter();


  date: any;
  you: boolean;
  user: any;
  tipe: any;
  public messages: Message[];
  constructor(private ChatService: ChatsService, private userService : UserService, private _router : Router, private _snackBar: MatSnackBar) {

  }

  ngOnInit(): void {

    this.tipe = this.message.tipe;
    moment.locale('es')
    this.date = moment(this.message.date).fromNow();  
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

  verImagen(image){
    Swal.fire({
      imageUrl: image,
      imageAlt: 'Custom image',
      showConfirmButton: false,
      background: 'transparent',
      imageWidth: 350
    })
  }

  viewImageUser(event){
    Swal.fire({
      imageUrl: event.target.src,
      imageAlt: 'Custom image',
      showConfirmButton: false,
      background: 'transparent',
      imageWidth: 350

    })
  }

  viewProfile(uid){
    this._router.navigate([`/user/profile/${uid}`]);
  }

  repImage(image, id, email){
    const data = {
      image : image
    }
    this.userService.revImage(data).subscribe(resp =>{
      console.log(resp.message.nudity, email);

        this.reportedImg.emit({resp: resp.message.nudity, id: id, email: email})
      
    })
  }

    //SMALL ALERTS
    openSnackBar(message: string, action: string) {
      this._snackBar.open(message, action, {
        duration: 5000,
      });
    }
}