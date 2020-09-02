import { Component, OnInit, Input, Output } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogExampleComponent } from '../dialogs/dialog-example/dialog-example.component';
import { RoomComponent } from '../dialogs/room/room.component';
import { RoomsService } from '../../services/rooms.service';
import { Observable } from 'rxjs';
import { Room } from '../../models/room';
import { MatTableDataSource } from '@angular/material/table';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [UserService, RoomsService]
})
export class HomeComponent implements OnInit {

  public user: any;
  rooms: Room[];
  searchRooms: Room[];
  constructor(
    public _userService: UserService,
    public _router: Router,
    public dialog: MatDialog,
    public salasService: RoomsService) { }

  async ngOnInit() {

    this.user = await this._userService.getCurrentUser();
    //console.log(user);
    if (this.user && this.user.emailVerified) {
      //console.log(this.user.displayName, this.user.photoURL);
      this._userService.getUserData(this.user.uid).subscribe(datauser => {
        console.log(datauser);
      });

      this.salasService.getRooms(this.user.uid).subscribe(rooms => {
        this.rooms = rooms;
        this.searchRooms = rooms;
      });
      
    } else {
      console.log('No hay usuario logueado');
      this._router.navigate(['/inicio']);
    }


  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;


    //this.topics.filter = filterValue.trim().toLowerCase();

  }
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

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.dialog.open(DialogExampleComponent, dialogConfig);
  }

  newRoom() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    dialogConfig.height = '500px';
    this.dialog.open(RoomComponent, dialogConfig);
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
