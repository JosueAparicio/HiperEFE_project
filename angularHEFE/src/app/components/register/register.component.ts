import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
//import Swal from '@sweetalert2/ngx-sweetalert2';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Global } from '../../services/global';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserService]

})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  constructor(public _userService: UserService, public _router: Router, private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{1,5}")]],
      password: ['', [Validators.required, Global.validPassword]],
      password2: ['', Validators.required],
      date: ['', Validators.required],
      displayName: ['', [Validators.required, Validators.minLength(5)]]

    });

  }
  async onRegister() {

    console.log(this.getDateInput());

    console.log('onRegister');

    if (this.registerForm.value.password === this.registerForm.value.password2 && this.getDateInput()) {
      Swal.fire({
        title: 'Por favor espere...',
        allowOutsideClick: false,
        onBeforeOpen: () => {
          Swal.showLoading()
        },
      });

      const create = this._userService.createAccount(this.registerForm.value);
      console.log(this.registerForm.value);
    }

  }
  getDateInput(): boolean {

    const _date = new Date(this.registerForm.value.date).getFullYear();
    const date = new Date(Date.now()).getFullYear();
    //console.log(date, _date);

    if (((date - 6) >= _date) && ((date - 60) <= _date)) {
      return true;
    }
    return false;
  }
  singInGoogle() {
    //this._userService.sinInGoogle() pendiente
    console.log('Google');
    try {
      this._userService.signInGoogle();
    } catch (error) {
      console.log(error);

    }

  }


}
