import { Component, OnInit, Input, Output } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [UserService]
})
export class HeaderComponent implements OnInit {

  @Input() status: string = '';

  constructor(
    public _userService: UserService,
    public _router: Router) { }

  ngOnInit(): void {
    
  }

  signOut(){
 
    Swal.fire({
      title: 'Cerrar sesion?',
      text: "Se cerrará esta sesion!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, salir'
    }).then((result) => {
      if (result.value) {
        this._router.navigate(['inicio'])
        Swal.fire(
          'Has salido!',
          'Vuelve pronto ;)',
          'success'
        )
      }
    })
  }

}
