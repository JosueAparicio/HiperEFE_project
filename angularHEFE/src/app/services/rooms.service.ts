import { Injectable } from "@angular/core";
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { Topic } from '../models/topics';

@Injectable()
export class RoomsService {


    public topics: Observable<Topic[]>;
    constructor(private bd: AngularFirestore) {


    }

    getTopics() {
        
    return this.topics = this.bd.collection('topics').valueChanges();
    }

 
}