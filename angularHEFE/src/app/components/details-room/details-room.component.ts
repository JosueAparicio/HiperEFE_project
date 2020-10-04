import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { RoomsService } from '../../services/rooms.service';
import { UserService } from '../../services/user.service';
import { UserModel } from '../../models/user-model.model';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Room } from '../../models/room';
import { ChatsService } from '../../services/chats.service';
import { Message } from '../../models/message';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Global } from 'src/app/services/global';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-details-room',
  templateUrl: './details-room.component.html',
  styleUrls: ['./details-room.component.css'],
  providers: [RoomsService, UserService, ChatsService]
})
export class DetailsRoomComponent implements OnInit {

  public user: any;
  public userData: any;
  public typeUser: string;
  public uidCreator: string;
  public codeRoom: string;
  public messageTemplate: string;
  public dataRoom: any;
  public numberMembersActive: number;
  public topicList: any
  public listMembersIndex: Array<UserModel>;
  private nameTeacher: string;
  showchat: boolean = false;
  messages: Message[];
  emojis: boolean = false;
  msgForm: FormGroup;
  public procesando: boolean;
  your: boolean;
  members: boolean;
  topics: boolean;
  encabezado: string;

  constructor(
    public _router: ActivatedRoute,
    public roomService: RoomsService,
    public userService: UserService,
    public router: Router,
    public location: Location,
    public _chatsService: ChatsService,
    private _snackBar: MatSnackBar,
    private _formBuilder: FormBuilder
  ) { }

  displayedColumns: string[];
  displayedTopicColumns: string[];
  dataSource = new MatTableDataSource<UserModel>();
  dataTopicSource = new MatTableDataSource<any>();

  async ngOnInit() {

    this.members = true;
    this.encabezado = 'Miembros de la sala';
    this.displayedTopicColumns = ['tema', 'descripcion'];
    this.msgForm = this._formBuilder.group({
      msg: ['', Validators.required]
    });

    this.uidCreator = this._router.snapshot.paramMap.get('creator');
    this.codeRoom = this._router.snapshot.paramMap.get('codeRoom');

    this.user = await this.userService.getCurrentUser();
    this.userService.getUserData(this.user.uid).subscribe(data => {

      this.userData = data;

      if (this._router.snapshot.paramMap.get('creator') == this.user.uid) {

        this.your = true;
        if (this.userData.cuenta == 'Docente') {
          this.displayedColumns = ['photoURL', 'displayName', 'email', 'symbol'];
          this.typeUser = this.userData.cuenta;
          this.nameTeacher = this.userData.displayName;

        } else {
          this.displayedColumns = ['photoURL', 'displayName', 'email'];
        }
      } else {

        this.displayedColumns = ['photoURL', 'displayName', 'email'];
        this.your = false;
      }
    })


    var listDataUser = [];
    this.roomService.getListMembers(this.uidCreator, this.codeRoom).subscribe(listUidMembers => {
      this.numberMembersActive = listUidMembers.length;

      listUidMembers.map(item => {
        listDataUser = [];
        this.userService.getUserData(item.uidStudent).subscribe(dataUser => {
          listDataUser.push(dataUser);
          this.dataSource.data = listDataUser;
          this.roomService.getListTopic(this.uidCreator, this.codeRoom).then((list) => {
            let listTopic = [];
            list.docChanges().forEach(element => {
              listTopic.push(element.doc.data());
            });
            this.dataTopicSource.data = listTopic;
            this.topicList = listTopic.length;
          });
        })
      });
    });

    this.roomService.getDataRoom(this.uidCreator, this.codeRoom).then((room) => {
      this.dataRoom = room.data();
      //console.log(this.dataRoom);
    });
    this._chatsService.getFullMessages(this.codeRoom).subscribe(msgs => {
      this.messages = msgs;
      //console.log(msgs);
    })

  }

  changeEmojis() {
    if (this.emojis == true) {
      this.emojis = false
    } else {
      this.emojis = true
    }
  }

  addEmoji($event) {
    let data = this.msgForm.get('msg');
    data.patchValue(data.value + $event.emoji.native)
  }

  definirFiltro(event: Event){
    if(this.members == true){
      this.applyFilter(event);
    }else if(this.topics == true){
      this.applyFilterTopics(event)
    }
    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilterTopics(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataTopicSource.filter = filterValue.trim().toLowerCase();
  }
  
  send() {
    if (this.msgForm.invalid) {
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
      this._chatsService.sendMessage(newMsg, this.codeRoom);
      this.procesando = false;
    }, 1000);


  }

  showChat() {
    console.log(this.showchat);

    if (this.showchat == true) {
      this.showchat = false;
    } else {
      this.showchat = true;
    }
  }

  getListTopics() {
    let listTopic = [];
    this.roomService.getListTopic(this.uidCreator, this.codeRoom).then((list) => {

      list.docChanges().forEach(element => {
        listTopic.push(element.doc.data());
      });
      sessionStorage.setItem('topics', JSON.stringify(listTopic));
      this.router.navigate(['/vr/lobby']);
    });
  }

  back() {
    this.location.back();
  }

  deleteMsg(event) {
    this._chatsService.deleteMsg(event.delete, this.codeRoom);
    //this.inputMessages();
  }
  reportMsg(event) {
    //console.log(event.reported);
    var cont = 0;
    this.procesando = true;
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
        this.userService.sendReportedEmail(event.email).subscribe(Response => {
          console.log(Response.message);
        }, error => {
          console.log(error);
        });
        this._chatsService.deleteReportedMsg(event.id, this.codeRoom);
      } else {
        this.openSnackBar('Evaluaremos este mensaje... Gracias por tu reporte.', 'Ok');
      };
      this.procesando = false;

    }, 2000);

  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

  private removeStudentRoom(element, reason) {
    Swal.fire({
      title: `Se eliminara a ${element.displayName}`,
      text: `Motivo de a Eliminacion: ${reason}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        let dataDelete = {
          uidCreator: this.uidCreator,
          codeRoom: this.codeRoom,
          uidStudent: element.uid,
          emailStudent: element.email,
          nameRoom: this.dataRoom.nombre,
          nameTeacher: this.nameTeacher,
          reasonDelete: reason
        }
        this.roomService.deleteStudentRoom(dataDelete);
      }
    })
  }

  async reasonDelete(element) {
    const { value: text } = await Swal.fire({
      title: `Ingrese el motivo de la expulsion`,
      icon: 'warning',
      input: 'textarea',
      inputPlaceholder: 'Describe el motivo...',
      inputAttributes: {
        'aria-label': 'Describe el motivo'
      },
      showCancelButton: true,
      confirmButtonText: 'Siguiente',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      inputValidator: (value) => {
        if (!value) {
          return 'Ingresa un motivo valido'
        }
      }
    })

    if (text) {
      this.removeStudentRoom(element, text);
    }
  }

  changeView(e){
    if(e == 1){
      this.members = false;
      this.topics = true;
      this.encabezado = 'Temas de la sala';

    }else if(e == 2){
      this.topics = false;
      this.members = true;
      this.encabezado = 'Miembros de la sala';

    }
  }

  viewProfile(uid){
    this.router.navigate([`/user/profile/${uid}`]);

  }

}
