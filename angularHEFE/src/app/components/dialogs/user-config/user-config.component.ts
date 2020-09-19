import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';

@Component({
  selector: 'app-user-config',
  templateUrl: './user-config.component.html',
  styleUrls: ['./user-config.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }
  }]
})
export class UserConfigComponent implements OnInit {

  isEditable = false;
  cuentaForm: FormGroup;
  conocimientoForm: FormGroup;
  dateForm: FormGroup;
  status = true;
  minDate: Date;
  maxDate: Date;

  public date: boolean;
  public load: boolean;


  constructor(public dialog: MatDialog, private _formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<UserConfigComponent>, private _snackBar: MatSnackBar) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 73, 0, 1);
    this.maxDate = new Date(currentYear - 7, 11, 31);

  }

  ngOnInit(): void {


    if (sessionStorage.getItem('date') == 'false') {
      this.date = false;
    } else {
      this.date = true;
    }

    console.log(this.date);

    this.cuentaForm = this._formBuilder.group({
      cuenta: ['', Validators.required]
    });
    this.conocimientoForm = this._formBuilder.group({
      conocimiento: ['', Validators.required]
    });
    this.dateForm = this._formBuilder.group({
      date: ['', Validators.required]
    });


  }


  onSubmit() {
    if (this.date == true) {

      if (this.conocimientoForm.invalid || this.cuentaForm.invalid) {

        this.openSnackBar('LLena todos los campos solicitados 1', 'Ok');

      } else {
        this.onClose();
      }

    } else {

      if (this.conocimientoForm.invalid || this.cuentaForm.invalid || this.dateForm.invalid) {

        this.openSnackBar('LLena todos los campos solicitados 2', 'Ok');

      } else {
        this.onClose();
      }

    }

  }


  //abre una pequena notificacion, recibe el mensaje y una accion..
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

  onClose() {
    this.data = {
      cuenta: this.cuentaForm.value.cuenta,
      conocimiento: this.conocimientoForm.value.conocimiento,
      date: moment(this.dateForm.value.date).calendar()
    }
    this.load = true;
    sessionStorage.clear();
    setTimeout(() => { this.dialogRef.close({ data: this.data }); this.load = false }, 800);
  }

}