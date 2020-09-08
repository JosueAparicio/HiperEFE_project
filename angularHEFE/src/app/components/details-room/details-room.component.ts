import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { RoomsService } from '../../services/rooms.service';
import { UserService } from '../../services/user.service';
import { UserModel } from '../../models/user-model.model';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: string;
  symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'La Tasca', weight: 'tasca@gmail.com', symbol: 'H' },
  { position: 2, name: 'El Inutil', weight: 'inutil@gmail.com', symbol: 'He' },
  { position: 3, name: 'Gustabo', weight: 'trabuko@gmail.com', symbol: 'Li' },
  { position: 4, name: 'Horacio', weight: 'horacios@gmail.com', symbol: 'Be' },
  { position: 5, name: 'Conway', weight: 'super@gmail.com', symbol: 'B' }
];
@Component({
  selector: 'app-details-room',
  templateUrl: './details-room.component.html',
  styleUrls: ['./details-room.component.css'],
  providers: [RoomsService, UserService]
})
export class DetailsRoomComponent implements OnInit {

  public user: any;
  public userData: any;
  public typeUser: string;
  public uidCreator: string;
  public codeRoom: string;
  public listMembersIndex: Array<UserModel>;
  constructor(
    public _router: ActivatedRoute,
    public roomService: RoomsService,
    public userService: UserService
  ) { }

  displayedColumns: string[];
  dataSource = new MatTableDataSource<UserModel>();

  async ngOnInit() {

    this.user = await this.userService.getCurrentUser();
    this.userService.getUserData(this.user.uid).subscribe(data => {
      this.userData = data;
      if(this.userData.cuenta=='Docente'){
        this.displayedColumns = ['photoURL', 'displayName', 'email', 'symbol'];
        this.typeUser = this.userData.cuenta;
      }else{
        this.displayedColumns = ['photoURL', 'displayName', 'email'];
      }
      
    })

    this.uidCreator = this._router.snapshot.paramMap.get('creator');
    this.codeRoom = this._router.snapshot.paramMap.get('codeRoom');
    var listDataUser = [];
    this.roomService.getListMembers(this.uidCreator, this.codeRoom).subscribe(listUidMembers => {
      listUidMembers.map(item => {
        listDataUser = [];
        this.userService.getUserData(item.uidStudent).subscribe(dataUser => {
          listDataUser.push(dataUser);  
          this.dataSource.data = listDataUser;
        })
      });
    });

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  prueba(userJoin) {

  }

}
