import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Topic } from '../models/topics';
import { Room } from '../models/room';
import { Global } from './global';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs/operators';


@Injectable()
export class RoomsService {


  public topics: Observable<Topic[]>;
  public rooms: Observable<Room[]>;
  public creatorRoom: any;
  public dataRoom: any;
  public topicsCollection: AngularFirestoreCollection;
  public topicsSelectedCollection: AngularFirestoreCollection;
  public roomsCollection: AngularFirestoreCollection;
  public MembersRoom: AngularFirestoreCollection;
  public listTopics: AngularFirestoreCollection;

  public listRooms: AngularFirestoreDocument;
  public docRoom: AngularFirestoreDocument;
  public studentRoom: AngularFirestoreDocument;
  constructor(private bd: AngularFirestore, private _snackBar: MatSnackBar) {

  }

  getTopics() {
    this.topicsCollection = this.bd.collection('topics');
    return this.topics = this.topicsCollection.valueChanges();
  }

  getRooms(uid, typeRoom) {
    this.roomsCollection = this.bd.collection(`users/${uid}/${typeRoom}/`);
    return this.rooms = this.roomsCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Room;
        data.id = a.payload.doc.id;
        return data;
      })
    }));
  }

  getCreatorRoom(codeRoom) {
    this.listRooms = this.bd.collection(`rooms/`).doc(codeRoom);
    return this.creatorRoom = this.listRooms.ref.get();
  }

  getDataRoom(uid, codeRoom) {
    this.docRoom = this.bd.collection(`users/${uid}/salas/`).doc(codeRoom);
    return this.dataRoom = this.docRoom.ref.get();
  }

  getCollectionRoom(uid, codeRoom) {
    this.roomsCollection = this.bd.collection(`users/${uid}/salas/${codeRoom}/members/`);
    return this.roomsCollection.ref.get();
  }

  getCollectionRoomAsync(uid, codeRoom) {
    this.roomsCollection = this.bd.collection(`users/${uid}/salas/${codeRoom}/members/`);
    return this.roomsCollection.valueChanges();
  }

  addRoom(room) {
    console.log(room);

    const idRoom = room.user.displayName.substring(0, 2).toLowerCase() + room.user.uid.substring(0, 2).toLowerCase() + Global.generarNumero(1000, 9999);
    const newDoc = {
      uidCreador: room.user.uid
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
    }).finally(function () { });
  }

  addMemberToTheROOM(data) {
    this.roomsCollection = this.bd.collection(`users/${data.uidCreador}/salas/${data.codeRoom}/members/`);
    this.roomsCollection.doc(data.dataMember.uidStudent).set(data.dataMember).then((resp) => console.log('Exito')).catch(error => console.log(error));

    this.roomsCollection = this.bd.collection(`users/${data.dataMember.uidStudent}/joinRoom/`);
    this.roomsCollection.doc(data.codeRoom).set(data.dataRoom).then((resp) => console.log(resp)).catch(error => console.log(error));

  }

  getListMembers(uidCreator, codeRoom) {
    this.MembersRoom = this.bd.collection(`users/${uidCreator}/salas/${codeRoom}/members`);
    return this.MembersRoom.valueChanges();
  }

  getListTopic(uidCreator, codeRoom) {
    this.listTopics = this.bd.collection(`users/${uidCreator}/salas/${codeRoom}/topics`);
    return this.listTopics.ref.get();
  }

  deleteStudentRoom(uidCreator, codeRoom, uidStudent) {
    this.studentRoom = this.bd.collection(`users/${uidCreator}/salas/${codeRoom}/members`).doc(uidStudent);
    this.studentRoom.delete().then(() => {
      this.openSnackBar('Se ha eliminado al estudiante', 'ok');
      this.studentRoom = this.bd.collection(`users/${uidStudent}/joinRoom`).doc(codeRoom);
      this.studentRoom.delete().catch((error) => {
        this.openSnackBar('Error, Intente mas tarde', 'ok');
      });
    }).catch((error) => {
      this.openSnackBar('Error, Intentelo mas Tarde', 'ok')
    });
  }

  //SMALL ALERTS
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }
}