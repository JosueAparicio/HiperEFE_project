import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Global } from 'src/app/services/global';
import Swal from 'sweetalert2';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.css']
})
export class AccessComponent implements OnInit {

  hide = true;
  hiden = true;
  passwordsForm: FormGroup;
  update: boolean;
  @Input() user: any;

  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar, private _userService: UserService) { }

  ngOnInit(): void {
    this.passwordsForm = this.fb.group({
      passwordNow: ['', Validators.required],
      newPassword: ['', [Validators.required, Global.validPassword]],
      newPasswordRepeat: ['', Validators.required]
    });
  }

  updatePassword() {

    if (this.passwordsForm.value.newPassword === this.passwordsForm.value.newPasswordRepeat) {
      Swal.fire({
        title: 'Por favor espera...',
        allowOutsideClick: false,
        onBeforeOpen: () => {
          Swal.showLoading()
        },
      });

      this._userService.reauthentication(this.passwordsForm.value.passwordNow, this.user.email).then(() => {
        console.log('reautenticado');
        this._userService.updatePasword(this.passwordsForm.value.newPassword).then(() => {
          console.log('update');

          Swal.fire('Listo!', `La contraseña se actualizó con exito!`, 'success');
          this.passwordsForm.reset({
            'passwordNow': '',
            'newPassword': '',
            'newPasswordRepeat': ''
          });

        }).catch(err => {
          console.log(err);
          Swal.fire('Error!', `Algo salio mal, intentalo mas tarde`, 'error');
        });

      }).catch(err => {
        console.log(err);
        Swal.fire('Error!', `Contraseña incorrecta!`, 'error');
      });


    }
  }

}
