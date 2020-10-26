import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-verificar-email',
  templateUrl: './verificar-email.component.html',
  styleUrls: ['./verificar-email.component.css'],
  providers: [UserService]
})
export class VerificarEmailComponent implements OnInit {

  public user$: Observable<any> = this._userService._afAuth.user;

  constructor(private _userService: UserService) { }

  ngOnInit(): void {
  }

  async onSendVE() {
    try {
      console.log('Enviando..');
      Swal.fire({
        title: 'Por favor espere...',
        allowOutsideClick: false,
        onBeforeOpen: () => {
          Swal.showLoading()
        },
      });
      await this._userService.sendVerificationEmail();

    } catch (error) {
      Swal.fire('Error!', 'Parece que algo ha salido mal, intantelo más tarde', 'error');
    }


  }


}
