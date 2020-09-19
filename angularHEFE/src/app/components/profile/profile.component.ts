import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [UserService]
})
export class ProfileComponent implements OnInit {

  constructor(private _router: ActivatedRoute, private _userService: UserService, private _snackBar: MatSnackBar) { }
  general: boolean;
  acceso: boolean;
  otras: boolean;
  user: any;
  date: any;
  hide = true;
  hiden = true;
  list: any;
  iam: any;
  your: boolean;
  other: boolean;
  async ngOnInit(): Promise<void> {
    const uid = this._router.snapshot.paramMap.get('uid');

   this.iam = await this._userService.getCurrentUser();
    this._userService.getUserData(uid).subscribe(datauser => {
      this.user = datauser;
      if(this.iam.uid == this.user.uid){this.your = true; this.general = true}else{this.other=true; this.otras = true}
      this.date = moment().diff(this.user.date, 'years', false)

      if(this.user.cuenta == 'Docente'){
        this._userService.getList(this.user.uid, 'salas').subscribe(na =>{
          this.list = na;
          
        })
      }else{
        this._userService.getList(this.user.uid, 'joinRoom').subscribe(na =>{
          this.list = na;

        })
      }
      
    });



  }

  mostrarVista(e) {
    if (e == 1) {
      this.general = true;
      this.acceso = false;
      this.otras = false;
    } else if (e == 2) {
      this.general = false;
      this.acceso = true;
      this.otras = false;
    } else if (e == 3) {
      this.general = false;
      this.acceso = false;
      this.otras = true;
    }
  }




  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

}
