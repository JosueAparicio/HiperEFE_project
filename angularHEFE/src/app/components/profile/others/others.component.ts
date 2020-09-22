import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { Room } from '../../../models/room';
import Swal from 'sweetalert2';
import { UserService } from '../../../services/user.service';
@Component({
  selector: 'app-others',
  templateUrl: './others.component.html',
  styleUrls: ['./others.component.css'],
  providers: [UserService]
})
export class OthersComponent implements OnInit {

  constructor(private sanitizer: DomSanitizer, private fb: FormBuilder, private _snackBar: MatSnackBar, private _userService:UserService) { }

  public preview: any;
  imgView: any;
  file: any;
  procesando: boolean;
  photos: any;
  @Input() user: any;
  @Input() myUid: any;
  @Input() rooms: Room[];

  your: any;

  ngOnInit(): void {
      this._userService.getLastProfiles(this.user.uid).subscribe(profiles=>{
      this.photos = profiles;

    })
    if(this.user.uid == this.myUid){this.your=true}

  }

  newImage(e) {
    //console.log(e.target.result);\
    this.file = e.target.files[0];
    this.imgView = true
    var result;
    var reader = new FileReader();
    reader.onload = function (i) {
      result = i.target.result;
    }
    setTimeout(() => { this.preview = result as string;  }, 1000);
    reader.readAsDataURL(this.file as Blob);
    
  }

  saveProfileImage(){
    if(this.file){
      this._userService.saveNewProfilePhoto(this.user, this.file);
      this.procesando = true;
      setTimeout(() => { this.procesando = false; this.imgView= false}, 3500);

    } else{
      this.openSnackBar('No hay imagen seleccionada', 'Ok')
    }
  }

  viewImage(img){
    Swal.fire({
      imageUrl: img,
      imageAlt: 'Custom image',
      showConfirmButton: false,
      background: 'transparent',
      imageWidth: 350
    })    
  }

  selectProfile(img){
    this.alert();
    const newData = this.user;
    newData.photoURL = img;
    this._userService.updateUserData(newData);
  }

  deleteImage(id){
    this.alert()
    this._userService.deleteProfilePhoto(this.user.uid, id);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }
  getSantizeUrl(url: string) {//limpia la url de la imagen ya que SVG aun no es del todo compatible...
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  alert(){
    Swal.fire({
      title: 'Por favor espera...',
      allowOutsideClick: false,
      onBeforeOpen: () => {
        Swal.showLoading()
      },
    });
  }
}

