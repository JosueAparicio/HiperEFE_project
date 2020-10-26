import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css'],
  providers: [UserService]
})
export class GeneralComponent implements OnInit {
  @Input() user: any;
  updateForm: FormGroup;
  procesando: boolean;
  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar, private _userService: UserService) { }

  async ngOnInit(): Promise<void> {
    //asignar validaciones al formulario
    this.updateForm = this.fb.group({
      displayName: ['', Validators.minLength(5)],
      bio: [''],

    });

  }

  updateUserData() {
    if (!this.updateForm.value.displayName && !this.updateForm.value.bio ) {
      this.openSnackBar('No hay cambios almacenados!', 'Entendido');
      return;
    } 
    if (this.updateForm.value.displayName.trim()=='' && this.updateForm.value.bio.trim() =='') {
      this.openSnackBar('No hay cambios almacenados!', 'Entendido');
      return;
    }

    this.procesando = true;
    if (!this.updateForm.value.displayName || this.updateForm.value.displayName.trim() == '') {
      this.updateForm.value.displayName = this.user.displayName;
    }
    if (!this.updateForm.value.bio || this.updateForm.value.bio.trim() == '' ) {
      this.updateForm.value.bio = this.user.bio;
      //console.log(this.updateForm.value.bio);
    }

    setTimeout(() => {
      console.log(this.updateForm.value);
      const userData = this.user;
      userData.displayName = this.updateForm.value.displayName;
      userData.bio = this.updateForm.value.bio;
      this._userService.updateUserData(userData);
      setTimeout(() => { this.procesando = false }, 2000);

      this.updateForm.reset();
    }, 700);


  }

  //abre una pequena notificacion, recibe el mensaje y una accion..
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
