import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Message } from '../models/message';
import { Room } from '../models/room';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';


@Injectable()
export class ChatsService {

  public messages: Observable<Message[]>;
  public msgs : Message;
  public message: Array<Message>;
  public rooms: Observable<Room[]>;
  public roomsCollection: AngularFirestoreCollection;
  public msgCollection: AngularFirestoreCollection;
  public user: Observable<any>;
  public downloadImage: any;
  constructor(private bd: AngularFirestore, private _snackBar: MatSnackBar, private storage: AngularFireStorage) {

  }

  getRooms(user) {
    if (user.cuenta == 'Docente') {
      this.roomsCollection = this.bd.collection(`users/${user.uid}/salas`);
    } else {
      this.roomsCollection = this.bd.collection(`users/${user.uid}/joinRoom`);
    }

    return this.rooms = this.roomsCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Room;
        data.id = a.payload.doc.id;
        //console.log(data);
        return data;
      })
    }));


  }
  getLastMessage(room) {
    this.msgCollection = this.bd.collection(`rooms/${room}/chat`, ref => ref.orderBy('date', 'desc').limit(1));
    return  this.msgCollection.snapshotChanges().pipe(map(actions => {
      this.message = []
      return actions.map(a => {
        const data = a.payload.doc.data() as Message;
        data.id = a.payload.doc.id
        return  data;
      })
    }));
  }

  getUserMsg(uid) {
    return this.bd.collection(`users`).doc(uid).valueChanges();
  }

  getFullMessages(room) {
    
    this.msgCollection = this.bd.collection(`rooms/${room}/chat/` , ref => ref.orderBy('date', 'desc').limit(50));
    //return this.messages =this.msgCollection.valueChanges();
   return this.messages = this.msgCollection.snapshotChanges().pipe(map(actions => {
      
      return actions.map(a => {
        const data = a.payload.doc.data() as Message;
        data.id = a.payload.doc.id
        this.msgs = data;
        //console.log(data);
        
        return data;
      })
    }));


  }

 sendMessage(msg, room){
   this.msgCollection = this.bd.collection(`rooms/${room}/chat/`);
   this.msgCollection.add(msg).then(resp =>
     console.log('enviado')
   ).catch(err => console.log(err));
 }

 deleteMsg(id, room){
  this.msgCollection = this.bd.collection(`rooms/${room}/chat/`);
    this.msgCollection.doc(id).delete().then(()=>this.openSnackBar('Mensaje eliminado', 'Ok')).catch(err=>this.openSnackBar('Intentalo mas tarde', 'Ok'));
 }

 uploadImage(data){

  const filepath = `images/chat/${data.room}/${data.file.name}`;
  const fileRef = this.storage.ref(filepath);
  const task = this.storage.upload(filepath, data.file);
  task.snapshotChanges().pipe(
    finalize(()=>{
      console.log('img subida, bajando...');
      fileRef.getDownloadURL().subscribe(url =>{
        console.log(url);
        this.msgCollection = this.bd.collection(`rooms/${data.roomId}/chat/`);
        var newMessage = {
          message: data.msg,
          uid: data.uid,
          date: Date.now(),
          tipe: 'img',
          image: url
        }
        this.msgCollection.add(newMessage).then(resp =>
          console.log('enviado')
        ).catch(err => console.log(err));
      })
  })).subscribe();

 }



   //SMALL ALERTS
   openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
}