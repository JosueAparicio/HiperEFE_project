import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import { Observable} from 'rxjs';
import { Topic } from '../models/topics';
import { Room } from '../models/room';
import { Global } from './global';
import {MatSnackBar} from '@angular/material/snack-bar';
import { map } from 'rxjs/operators';


@Injectable()
export class RoomsService {


  public topics: Observable<Topic[]>;
  public rooms: Observable<Room[]>;
  public topicsCollection: AngularFirestoreCollection;
  public topicsSelectedCollection: AngularFirestoreCollection;
  public roomsCollection: AngularFirestoreCollection;
  constructor(private bd: AngularFirestore, private _snackBar: MatSnackBar) {


  }

  getTopics() {
    this.topicsCollection = this.bd.collection('topics');
    return this.topics = this.topicsCollection.valueChanges();
  }

  getRooms(uid){
    this.roomsCollection = this.bd.collection(`users/${uid}/salas/`);
    return this.rooms =this.roomsCollection.snapshotChanges().pipe(map(actions =>{
        return actions.map (a => {
          const data = a.payload.doc.data() as Room;
          data.id = a.payload.doc.id;
          return data;
        })
    }));
  }

  addRoom(room) {
    console.log(room);
    
    const idRoom = room.user.displayName.substring(0, 2).toLowerCase() + room.user.uid.substring(0, 2).toLowerCase() + Global.generarNumero(1000, 9999);
    const newDoc ={
      uidCreador : room.user.uid
    }
    this.roomsCollection = this.bd.collection(`users/${room.user.uid}/salas`);
    this.roomsCollection.doc(idRoom).set(room.data).then(resp => {
      this.roomsCollection = this.bd.collection('rooms');

      this.roomsCollection.doc(idRoom).set(newDoc);
      this.openSnackBar('Se agrego la sala', 'Ok');
     this.topicsSelectedCollection = this.bd.collection(`users/${room.user.uid}/salas/${idRoom}/topics`);

        room.topics.forEach(row => {
          this.topicsSelectedCollection.add(row).then(resp => console.log('agregado')).catch(error => console.log(error));
      });

    }).catch(error => {
      console.log(error);
      this.openSnackBar('Ha ocurrido un error', 'Ok');
    }).finally( function(){});
  }

  addMemberToTheROOM(data){
    this.roomsCollection = this.bd.collection(`users/${data.uid}/salas/${data.idRoom}/members`);
    this.roomsCollection.add(data.member).then(resp => console.log('agregado')).catch(error => console.log(error));

  }


  //SMALL ALERTS
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }
}