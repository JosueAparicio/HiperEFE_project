import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ChatsService } from '../../services/chats.service';
import { Room } from '../../models/room';
import { Message } from '../../models/message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Global } from '../../services/global';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css'],
  providers: [UserService, ChatsService]

})
export class ChatsComponent implements OnInit {




  public user: any;
  public rooms: Room[];
  public ReemplaceRooms: Room[];

  public conversation: any;
  public messages: Message[];
  public msgImage: string;
  msgForm: FormGroup;
  msgImageForm: FormGroup;
  public procesando: boolean;
  emojis: boolean = false;
  constructor(public _userService: UserService, public _chatsService: ChatsService, private _formBuilder: FormBuilder, private _snackBar: MatSnackBar) { }

  async ngOnInit(): Promise<void> {

    this.conversation = 'Empty';
    this.msgForm = this._formBuilder.group({
      msg: ['', Validators.required]
    });
    this.msgImageForm = this._formBuilder.group({
      msg: ''
    });

    const user = await this._userService.getCurrentUser();
    this._userService.getUserData(user.uid).subscribe(datauser => {
      this.user = datauser;
      this._chatsService.getRooms(datauser).subscribe(rooms => {
        this.rooms = rooms;
        this.ReemplaceRooms = this.rooms;


      });
    });

  }

  addEmoji($event) {
    let data = this.msgForm.get('msg');
    if($event.emoji.native == null || $event.emoji.native =='null'){
      return;
    }
    
    data.patchValue(data.value + $event.emoji.native)
  }

  changeEmojis() {
    if (this.emojis == true) {
      this.emojis = false
    } else {
      this.emojis = true
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    const arrayFilter = this.ReemplaceRooms.filter((val, index)=>{
      const Roomname = val.nombre.toLowerCase();

      if (Roomname.indexOf(filterValue) != -1){
        return true;
      }else{
        return false;
      }
    })

    this.rooms = arrayFilter;
  }
  inputMessages() {
    this.messages = [];
    this._chatsService.getFullMessages(this.conversation.id).subscribe(msgs => {
      this.messages = msgs;
      //console.log(msgs);
    })
  }
  mostrarChat(event) {
    //console.log(event.conversation.id);
    if (event.conversation.id == this.conversation.id) {
      return
    }
    this.conversation = event.conversation;
    this.inputMessages()

  }
  send() {
    if (this.msgForm.invalid || this.conversation == 'Empty') {
      console.log('neeh');
      return;
    }
    this.procesando = true;
    var newMsg = {
      uid: this.user.uid,
      message: this.msgForm.value.msg,
      date: Date.now()
    }

    this.msgForm.reset();
    setTimeout(() => {
      this._chatsService.sendMessage(newMsg, this.conversation.id);
      this.procesando = false;
    }, 1000);


  }
  deleteMsg(event) {
    this._chatsService.deleteMsg(event.delete, this.conversation.id);
    //this.inputMessages();
  }
  reportMsg(event) {
    //console.log(event.reported);
    this.procesando = true;
    var cont = 0;
    Global.report.forEach(word => {
      //console.log(word)
      if (event.reported.toLowerCase().indexOf(word) !== -1) {
        console.log('encontrado => ' + word);
        cont++;
      }
    })
    console.log(event.email);

    setTimeout(() => {
      if (cont > 0) {
        this.openSnackBar('El mensaje contiene lenguaje ofensivo, gracias por tu reporte', 'Ok');
        this._userService.sendReportedEmail(event.email).subscribe(Response => {
          console.log(Response.message);
        }, error => {
          console.log(error);
        });
        this._chatsService.deleteReportedMsg(event.id, this.conversation.id);
      } else {
        this.openSnackBar('Evaluaremos este mensaje... Gracias por tu reporte.', 'Ok');
      };
      this.procesando = false;
    }, 2000);

  }


  async onUploadImage() {

    
    if (this.conversation == 'Empty') {
      return;
    }
    const { value: file } = await Swal.fire({
      title: 'Selecciona una imagen',
      input: 'file',
      inputAttributes: {
        'accept': 'image/*',
        'aria-label': 'Sube tu imagen aqui'
      }
    })

    if (file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        Swal.fire({
          title: 'Imagen lista para enviar',
          imageUrl: e.target.result as string,
          imageAlt: 'Imagen lista',
          input: 'textarea',
          inputPlaceholder: 'Type your message here...',
          inputAttributes: {
            'aria-label': 'Type your message here'
          },
          confirmButtonText: 'Enviar!'
        }).then((result) => {          
          if (result.isConfirmed) {
            this.procesando = true;
            console.log(result.value)
            var data = {
              file: file,
              room: this.conversation.nombre,
              roomId: this.conversation.id,
              msg: result.value,
              uid: this.user.uid
            };

            this._chatsService.uploadImage(data);
            setTimeout(() => { this.procesando = false; }, 2500);
          }
        })
      }
      reader.readAsDataURL(file as Blob)
    }

  }


  //SMALL ALERTS
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

  viewImage(event) {
    Swal.fire({
      imageUrl: event.target.src,
      imageAlt: 'Custom image',
      showConfirmButton: false,
      background: 'transparent',
      imageWidth: 350
    })
  }

}
