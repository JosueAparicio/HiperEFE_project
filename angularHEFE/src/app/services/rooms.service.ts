import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { Topic } from '../models/topics';
import { Room } from '../models/room';
import { Global } from './global';
import { ErrorComponent } from '../components/error/error.component';

@Injectable()
export class RoomsService {


  public topics: Observable<Topic[]>;
  public rooms: Observable<Room[]>;
  public topicsCollection: AngularFirestoreCollection;
  public topicsSelectedCollection: AngularFirestoreCollection;
  public roomsCollection: AngularFirestoreCollection;
  constructor(private bd: AngularFirestore) {


  }

  getTopics() {
    this.topicsCollection = this.bd.collection('topics');
    return this.topics = this.topicsCollection.valueChanges();
  }

  getRooms(uid){
    this.roomsCollection = this.bd.collection(`users/${uid}/salas/`);
    return this.rooms =this.roomsCollection.valueChanges();
  }

  addRoom(room) {

    const idRoom = room.user.displayName.substring(0, 2).toLowerCase() + room.user.uid.substring(0, 2).toLowerCase() + Global.generarNumero(1000, 9999);

    this.roomsCollection = this.bd.collection(`users/${room.user.uid}/salas`);
    this.roomsCollection.doc(idRoom).set(room.data).then(resp => {

     this.topicsSelectedCollection = this.bd.collection(`users/${room.user.uid}/salas/${idRoom}/topics`);

        room.topics.forEach(row => {
          this.topicsSelectedCollection.add(row).then(resp => console.log('agregado')).catch(error => console.log(error));
      });

    }).catch(error => {
      console.log(error);

    });
  }

  addMemberToTheROOM(data){
    this.roomsCollection = this.bd.collection(`users/${data.uid}/salas/${data.idRoom}/members`);
    this.roomsCollection.add(data.member).then(resp => console.log('agregado')).catch(error => console.log(error));

  }


}