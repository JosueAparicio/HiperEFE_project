import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Global } from '../../services/global';


@Component({
  selector: 'app-general-validations',
  templateUrl: './general-validations.component.html',
  styleUrls: ['./general-validations.component.css'],
  providers: [UserService]
})
export class GeneralValidationsComponent implements OnInit {

  public status: string = 'null';
  public code: string;
  public action: string;
  resetForm: FormGroup;

  constructor(public _userService: UserService, public _router: Router, private _route: ActivatedRoute, private fb: FormBuilder) {


  }

  async ngOnInit() {


    this._route.queryParams.subscribe(params => {
      this.code = params['mode'];
      this.action = params['oobCode'];
      console.log(this.code);
      console.log(this.action);
    });

    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Global.validPassword]],
      password2: ['', [Validators.required, Global.igualdad]]

    });

    switch (this.code) {
      case 'resetPassword':
        this.status = this.code;
        //this._userService.recoverPassword(action);
        break;
      case 'recoverEmail':
        this.status = this.code;
        //this._userService.handleRecoverEmail(action);
        break;
      case 'verifyEmail':
        this.status = this.code;
        try {
          const verify = this._userService.handleVerifyEmail(this.action);
          if (verify) {
            Swal.fire('Listo!', 'Se ha verificado su cuenta, Inicie sesion nuevamente !!!', 'success');
            this._router.navigate(['/login']);
          } else {
            Swal.fire('Oh no!', 'Ha ocurrido un error, intentalo de nuevo mas tarde', 'error');

          }
        } catch (error) {
          Swal.fire('Oh no!', 'Ha ocurrido un error, intentalo de nuevo mas tarde', 'error');

        }

        break;
      default:
    }
  }

  async onSaveNewPassword() {
    /*
    try {
      await this._userService.recoverPassword(this.action, this.resetForm.value.password).then(async resp => {
        try {
          const resp = await this._userService.getAuth().confirmPasswordReset(this.action, this.resetForm.value.password)
            .then(async resp => {
              Swal.fire('Listo!', 'Se ha actualizado su contraseña, Inicie sesion nuevamente !!!', 'success');
              this._router.navigate(['/login']);
            }).catch(error => {
              console.log(error);
              Swal.fire('Caducado!', 'El enlace solo es valido para una cambio de contraseña', 'error');
            });;
        }
        catch (error) {
          console.log(error);
          Swal.fire('Oh no!', 'Ha ocurrido un error, intentalo de nuevo mas tarde', 'error');
        }
      }).catch(error => {
        console.log(error);
        Swal.fire('Oh no!', 'Ha ocurrido un error, intentalo de nuevo mas tarde', 'error');
      });


    } catch (error) {
      Swal.fire('Oh no!', 'Ha ocurrido un error, intentalo de nuevo mas tarde', 'error');
    }
  */
   console.log(this.resetForm.value);
 
  }

  alert() {
    alert('hola');
  }


}
