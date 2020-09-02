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
  public creatorRoom: Observable<any>;
  public dataRoom: any;
  public topicsCollection: AngularFirestoreCollection;
  public topicsSelectedCollection: AngularFirestoreCollection;
  public roomsCollection: AngularFirestoreCollection;
  public listRooms: AngularFirestoreDocument;
  public docRoom: AngularFirestoreDocument;
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

  getCreatorRoom(codeRoom){
    this.listRooms = this.bd.collection(`rooms/`).doc(codeRoom);
    return this.creatorRoom = this.listRooms.valueChanges();
  }

  getDataRoom(uid, codeRoom){
    this.docRoom = this.bd.collection(`users/${uid}/salas/`).doc(codeRoom);
    return this.dataRoom = this.docRoom.ref.get();
  }

  getCollectionRoom(uid, codeRoom){
    this.roomsCollection = this.bd.collection(`users/${uid}/salas/${codeRoom}/members/`);
    return this.roomsCollection.ref.get();
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
    this.roomsCollection = this.bd.collection(`users/${data.uidCreador}/salas/${data.codeRoom}/members/`);
    this.roomsCollection.doc(data.dataMember.uidStudent).set(data.dataMember).then((resp) => console.log('Exito')).catch(error => console.log(error));
    
    this.roomsCollection = this.bd.collection(`users/${data.dataMember.uidStudent}/joinRoom/`);
    this.roomsCollection.doc(data.codeRoom).set(data.dataRoom).then((resp) => console.log(resp)).catch(error => console.log(error));

  }


}