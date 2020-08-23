import { Component, OnInit, Input, Output } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import  {MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogExampleComponent } from '../dialogs/dialog-example/dialog-example.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [UserService]
})
export class HomeComponent implements OnInit {

  constructor(
    public _userService: UserService,
    public _router: Router,
    public dialog: MatDialog) { }

  async ngOnInit(){
    
    const user = await this._userService.getCurrentUser();
    console.log(user);
    
    if (user && user.emailVerified){
      console.log(user);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Bienvenido '+user.email,
        showConfirmButton: false,
        timer: 1500
      });
    } else{
      console.log('No hay usuario logueado');
      this._router.navigate(['/inicio']);
    }
  }

   singOut(){
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

}
