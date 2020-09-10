import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { RoomsService } from '../../services/rooms.service';
import { UserService } from '../../services/user.service';
import { UserModel } from '../../models/user-model.model';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


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
  public messageTemplate: string;
  public dataRoom: any;
  public numberMembersActive: number;
  public listMembersIndex: Array<UserModel>;
  constructor(
    public _router: ActivatedRoute,
    public roomService: RoomsService,
    public userService: UserService,
    public router: Router,
    public location: Location
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
      this.numberMembersActive = listUidMembers.length;
      
      listUidMembers.map(item => {
        listDataUser = [];
        this.userService.getUserData(item.uidStudent).subscribe(dataUser => {
          listDataUser.push(dataUser);  
          this.dataSource.data = listDataUser;
        })
      });
    });

    this.roomService.getDataRoom(this.uidCreator, this.codeRoom).then((room)=>{
      this.dataRoom = room.data();
      console.log(this.dataRoom);
    });

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getListTopics() {
    let listTopic = [];
    this.roomService.getListTopic(this.uidCreator, this.codeRoom).then((list)=>{
      
      list.docChanges().forEach(element => {
        listTopic.push(element.doc.data());
      });
      sessionStorage.setItem('topics', JSON.stringify(listTopic));
      this.router.navigate(['/vr/lobby']);
    });
  }

  back(){
    this.location.back();
  }

}
