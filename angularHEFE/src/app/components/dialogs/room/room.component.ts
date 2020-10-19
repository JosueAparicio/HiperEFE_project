import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { RoomsService } from '../../../services/rooms.service';
import { UserService } from '../../../services/user.service';
import { Topic } from '../../../models/topics';
import { Room } from '../../../models/room';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';




@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
  providers: [RoomsService, UserService]
})
export class RoomComponent implements OnInit {


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  newRoomForm: FormGroup;
  displayedColumns: string[] = ['select', 'Tema', 'Descripcion'];
  dataSource = new MatTableDataSource<Topic>();
  selection = new SelectionModel<Topic>(true, []);
  public load: boolean;

  constructor(public salasService: RoomsService, private fb: FormBuilder, private _snackBar: MatSnackBar, public _userService: UserService, public dialog: MatDialog,
  ) {

  }

  ngOnInit(): void {

    //asignar validaciones al formulario
    this.newRoomForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(5)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      maxParticipantes: ['', Validators.required],
      photo: ['']
    });



    //recoger datos desde firebase y montarlos en el template
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.salasService.getTopics().subscribe(topics => {
      console.log(topics);
      this.dataSource.data = topics;
      //this.topics = topics;
    });

  }



  //guardar una nueva sala
  async onSubmit() {
    const userOn = await this._userService.getCurrentUser();

    if (this.selection.selected.length > 5) {
      this.openSnackBar('Son 5 temas como maximo', 'Ok');

    } else if (this.selection.selected.length == 0) {
      this.openSnackBar('No hay ningun tema seleccionado', 'Ok');

    } else {
      this._userService.getUserData(userOn.uid).subscribe(data => {
        const userFull = {
          data: this.newRoomForm.value,
          topics: this.selection.selected,
          user: data
        }
        this.salasService.addRoom(userFull);

      });
      this.load = true;
      setTimeout(() => { this.onClose(); this.load = false }, 1000);

    }
  }
  onClose() {
    this.dialog.closeAll();
  }

  //aplicar un filtro para realizar busquedas
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();


    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //seleccionar todos los checkboxs
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  //seleccionar todas las filas
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => {
        this.selection.select(row)
      });

  }

  //selecciona una fila en concreto o todas
  checkboxLabel(row?: Topic): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.idTema + 1}`;
  }
  //actualiza la fila seleccionada
  updateCheckedList(event, row) {
    //console.log(event)
    if (event.checked) {
      //console.log(row);
      this.selection.select(row);

    } else {
      this.selection.deselect(row);
    }
  }
  //abre una pequena notificacion, recibe el mensaje y una accion..
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }



}

