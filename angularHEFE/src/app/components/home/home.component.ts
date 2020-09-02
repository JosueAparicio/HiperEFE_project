import { Component, OnInit} from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { DialogExampleComponent } from '../dialogs/dialog-example/dialog-example.component';
import { RoomComponent } from '../dialogs/room/room.component';
import { RoomsService } from '../../services/rooms.service';
import { Room } from '../../models/room';
import { UserConfigComponent } from '../dialogs/user-config/user-config.component';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [UserService, RoomsService]
})
export class HomeComponent implements OnInit {

  public user: any;
  rooms: Room[];
  ready: boolean;
  constructor(
    public _userService: UserService,
    public _router: Router,
    public dialog: MatDialog,
    public salasService: RoomsService) { }

  //verificaciones iniciales
  async ngOnInit() {

    const user = await this._userService.getCurrentUser();
    //console.log(user);
    if (user && user.emailVerified) {
      //console.log(this.user.displayName, this.user.photoURL);
      this._userService.getUserData(user.uid).subscribe(datauser => {
        //console.log(datauser);
        if(datauser){
          this.user = datauser;
        }else{
          this.user = user;
        }
          if(!this.user.photoURL){
            this.user.photoURL = user.photoURL;
          }
          if(!this.user.cuenta || !this.user.conocimiento || !this.user.date){
            if(!this.user.date){
              sessionStorage.setItem('date', 'false');
            }else{
              sessionStorage.setItem('date', 'true');
            }
  
            this.EditAccount();
          } else {
            this.salasService.getRooms(user.uid).subscribe(rooms => this.rooms = rooms);
            this.ready = true;
          }
        
      });

      
    } else {
      console.log('No hay usuario logueado');
      this._router.navigate(['/inicio']);
    }


  }
  //buscar
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;


    //this.topics.filter = filterValue.trim().toLowerCase();

  }
  //cerrar sesion
  singOut() {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: "Se cerrará tu sesión!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK'
    }).then(async (result) => {
      if (result.value) {

        Swal.fire({
          title: 'Cerrando Sesion...',
          allowOutsideClick: false,
          timer: 1000,
          onBeforeOpen: () => {
            Swal.showLoading()
          },
          onClose: () => {
            this._userService.signOut();
          }
        });
      }
    })
  }
  //prueba
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.dialog.open(DialogExampleComponent, dialogConfig);
  }
  //Dialog para crear una nueva sala
  newRoom() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    dialogConfig.height = '500px';
    dialogConfig.data = this.user;
    this.dialog.open(RoomComponent, dialogConfig);
    
  }

  EditAccount(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '70%';
    dialogConfig.height = '520px';
    dialogConfig.data = this.user;
    const ref = this.dialog.open(UserConfigComponent, dialogConfig );

    ref.afterClosed().subscribe(async res => {
      // received data 
      let newDate = res.data.date;
      if(res.data.date == ''){
        newDate = this.user.date;
      }
      const fullDaata= { 
        uid: this.user.uid,
        displayName: this.user.displayName,
        email: this.user.email,
        photoURL: this.user.photoURL,
        date: newDate,
        cuenta: res.data.cuenta,
        conocimiento: res.data.conocimiento
    }
    //console.log(fullDaata);
      setTimeout(() => {this._userService.createNewUser(fullDaata)}, 2000);
    })
  }
  
  async joinRoom(){
    const { value: codeRoom } = await Swal.fire({
      title: 'Ingresa el codigo de la sala',
      input: 'text',
      inputPlaceholder: 'XXXXXX',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'Ingrese un codigo de sala!'
        }
      }
    })

    if (codeRoom) {
      Swal.fire({
        title: 'Verificando Sala...',
        allowOutsideClick: true,
        onBeforeOpen: () => {
          this.verifiedRoom(codeRoom);
        }
      });
    }
  }

  private verifiedRoom(codeRoom: any) {
    this.salasService.getCreatorRoom(codeRoom).subscribe(uidCreator => {

      if(uidCreator){
        this.salasService.getDataRoom(uidCreator.uidCreador, codeRoom).then((dataRoom) => {
          if (dataRoom.exists) {
            this.salasService.getCollectionRoom(uidCreator.uidCreador, codeRoom).then((collectionMembers) => {
              if (collectionMembers.docs.length < dataRoom.data().maxParticipantes){
                Swal.fire({
                  icon: 'success',
                  title: 'Datos de la sala',
                  html: `<h3> ${dataRoom.data().nombre}</h3>
                     <p> ${dataRoom.data().descripcion} </p>`,
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Unirse',
                  cancelButtonText: 'Cancelar'
                }).then((result) => {
                  if (result.value) {
                    let packageRoom = {
                      uidCreador: uidCreator.uidCreador,
                      codeRoom: codeRoom,
                      dataMember: this.getDataUser(),
                      dataRoom: this.getDataRoom(dataRoom.data())
                    };
                    this.salasService.addMemberToTheROOM(packageRoom);
                  }
                });
              }else{
                Swal.fire({
                  icon: 'error',
                  title: 'Sala Completa, consulte con su docente'
                });
              }
            }); 
          }
        });
      }else{
        Swal.fire({
          icon:'error',
          title: 'Codigo de sala no existe, verifique de nuevo'
        })
      }
    });
  }

  private getDataUser(){
    let dataMember = {
      uidStudent: this.user.uid
    };
    return dataMember
  }

  private getDataRoom(room){
    let dataRoom = {
      nombre: room.nombre,
      descripcion: room.descripcion,
      photo: room.photo
    };
    return dataRoom
  }
}
