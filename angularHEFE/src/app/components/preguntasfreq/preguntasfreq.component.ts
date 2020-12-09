import { Component, OnInit } from '@angular/core';
import { FormControl,  Validators} from '@angular/forms';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-preguntasfreq',
  templateUrl: './preguntasfreq.component.html',
  styleUrls: ['./preguntasfreq.component.css'],
  providers: [UserService]

})
export class PreguntasfreqComponent implements OnInit {
  panelOpenState = false;
  email1 = new FormControl('', [Validators.required, Validators.email]);
  email2 = new FormControl('', [Validators.required, Validators.email]);
  denuncia = new FormControl('', [Validators.required]);
  pregunta = new FormControl('', [Validators.required]);


  constructor(private _userService: UserService ) { }

  ngOnInit(): void {

  }

  getErrorMessage() {
    if (this.email1.hasError('required')) {
      return 'Ingresa tu email';
    }

    return this.email1.hasError('email') ? 'Email invalido' : '';
  }

  getErrorMessage2() {
    if (this.email2.hasError('required')) {
      return 'Ingresa tu email';
    }

    return this.email2.hasError('email') ? 'Email invalido' : '';
  }


  sendAyuda(status){
    //console.log(this.email2.value, this.denuncia.value);
    Swal.fire({
      title: 'Por favor espere...',
      allowOutsideClick: false,
      onBeforeOpen: () => {
        Swal.showLoading()
      },
    });
    var email = '';
    var data;
    if (status== 'Denuncia'){
        email = this.email2.value;
         data = {
          email : email,
          denuncia : this.denuncia.value,
          status : status
        }
    } else {
      email = this.email1.value;
       data = {
        email : email,
        pregunta : this.pregunta.value,
        status : status
      }
    }

    this._userService.sendAyuda(data).subscribe(resp =>{
      console.log(resp);
      if(resp.status == 'success'){
        
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Gracias! trabajamos en ello',
          showConfirmButton: false,
          timer: 1500
      });
      }else if (resp.satatus == 'error'){
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Algo ha salido mal',
          showConfirmButton: false,
          timer: 1500
      });
      }
      
    })
  }

}
