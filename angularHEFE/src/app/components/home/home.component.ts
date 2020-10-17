import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
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
  public docente: any;
  public estudiante: any;
  public typeRoom: any;
  public ReemplaceRooms: Room[];
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
    if (user && user.emailVerified) {
      this._userService.getUserData(user.uid).subscribe(datauser => {

        if (datauser) {
          this.user = datauser;
        } else {
          this.user = user;
        }

        if (!this.user.photoURL) {
          this.user.photoURL = user.photoURL;
        }
        if (!this.user.cuenta || !this.user.conocimiento || !this.user.date) {
          if (!this.user.date) {
            sessionStorage.setItem('date', 'false');
          } else {
            sessionStorage.setItem('date', 'true');
          }

          this.EditAccount();
        } else {


          if (this.user.cuenta == 'Estudiante') {
            this.estudiante = this.user.cuenta;
            this.typeRoom = 'joinRoom';
          } else {
            this.docente = this.user.cuenta;
            this.typeRoom = 'salas'
          }
          this.salasService.getRooms(user.uid, this.typeRoom).subscribe(rooms => {
            this.rooms = rooms;
            this.ReemplaceRooms = this.rooms;
          });

          this.ready = true;
        }

      });


    } else {
      console.log('No hay usuario logueado');
      this._router.navigate(['/inicio']);
    }
    //hola como estan los quiero mucho :D

  }
  //buscar
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    //this.rooms.filter = filterValue.trim().toLowerCase();

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

  EditAccount() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '70%';
    dialogConfig.height = '520px';
    dialogConfig.data = this.user;
    const ref = this.dialog.open(UserConfigComponent, dialogConfig);

    ref.afterClosed().subscribe(async res => {
      // received data 
      let newDate = res.data.date;
      if (res.data.date == '') {
        newDate = this.user.date;
      }
      const fullDaata = {
        uid: this.user.uid,
        displayName: this.user.displayName,
        email: this.user.email,
        photoURL: this.user.photoURL,
        date: newDate,
        cuenta: res.data.cuenta,
        conocimiento: res.data.conocimiento
      }
      //console.log(fullDaata);
      setTimeout(() => { this._userService.updateUserandSendEmail(fullDaata) }, 2000);
    })
  }

  async joinRoom() {
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
        allowOutsideClick: false,
        onBeforeOpen: () => {
          this.verifiedRoom(codeRoom);
        }
      });
    }
  }

  private verifiedRoom(codeRoom: any) {
    this.salasService.getCreatorRoom(codeRoom).then((uidCreator) => {

      if (uidCreator.exists) {
        this.salasService.getDataRoom(uidCreator.data().uidCreador, codeRoom).then((dataRoom) => {
          if (dataRoom.exists) {
            this.salasService.getCollectionRoom(uidCreator.data().uidCreador, codeRoom).then((collectionMembers) => {
              if (collectionMembers.docs.length < dataRoom.data().maxParticipantes) {
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
                      uidCreador: uidCreator.data().uidCreador,
                      codeRoom: codeRoom,
                      dataMember: this.getDataUser(),
                      dataRoom: this.getDataRoom(dataRoom.data())
                    };
                    this.salasService.addMemberToTheROOM(packageRoom);
                  }
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Sala Completa, consulte con su docente'
                });
              }
            });
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Codigo de sala no existe, verifique de nuevo'
        })
      }
    });
  }

  private getDataUser() {
    let dataMember = {
      uidStudent: this.user.uid
    };
    return dataMember
  }

  private getDataRoom(room) {
    let dataRoom = {
      nombre: room.nombre,
      descripcion: room.descripcion,
      photo: room.photo,
      maxParticipantes: room.maxParticipantes
    };
    return dataRoom
  }
}
