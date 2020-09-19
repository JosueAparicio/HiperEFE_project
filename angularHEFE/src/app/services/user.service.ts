import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { finalize, first, map } from 'rxjs/operators';
import { User } from 'firebase';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { Global } from './global';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as firebase from 'firebase';
import { Room } from '../models/room';



@Injectable()
export class UserService {

    public user: User;
    public url: string;

    constructor(public _afAuth: AngularFireAuth, private _snackBar: MatSnackBar, private _router: Router, private _afirestore: AngularFirestore, private _hhtp: HttpClient, private storage: AngularFireStorage) {
        this.url = Global.url;

    }

    //AUTH GENERAL
    getAuth() {//desvuelve Auth
        return this._afAuth.auth;
    }
    async signIn(email: string, password: string) { //Inicio de sesion
        try {
            return await this._afAuth.auth.signInWithEmailAndPassword(email, password); //create a new account gg
        }
        catch (error) {
            Swal.close();

            console.log(error);
            if (error.code == 'auth/user-not-found') {
                Swal.fire('Error!', `El usuario <strong>${email}</strong> no existe`, 'error');

            } else if (error.code == 'auth/wrong-password') {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Contraseña invalida',
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire('Error!', `Algo salio mal, intentalo mas tarde`, 'error');
            }

        }
    }
    async signOut() { // cerrar sesion
        try {
            const result = await this._afAuth.auth.signOut();
            localStorage.clear()
            this._router.navigate(['/inicio']);
            return result;
        }
        catch (error) {
            console.log(error);
        }

    }
    async signInGoogle() {

        try {
            return await this._afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()).then(resp => {
                //console.log(resp.user);
                /*   const {uid, displayName, email, photoURL} = resp.user;
 */
            });
        } catch (error) {
            console.log(error);
        }

    }
    async createAccount(data) { //crear una cuenta nueva
        try {
            const result = await this._afAuth.auth.createUserWithEmailAndPassword(data.email, data.password).then(async resp => {

                const { uid, displayName, email, photoURL } = resp.user;
                const dataUser = {
                    uid,
                    displayName: data.displayName,
                    email,
                    photoURL,
                    date: data.date,
                    cuenta: null,
                    conocimiento: null,
                    bio: null
                }
                this.createNewUser(dataUser);
                this._router.navigate(['verify-account/' + resp.user.uid]);
                this.sendVerificationEmail();

            }).catch(error => {
                console.log(error);
                if (error.code == 'auth/email-already-in-use') {
                    Swal.fire('Error!', `Ya existe un usuario registrado con <strong>${data.email}</strong>`, 'error');
                } else {
                    Swal.fire('Error!', `Algo salio mal, intentalo mas tarde`, 'error');
                }
            });

            return result;

        }
        catch (error) {
            console.log(error);
            Swal.fire('Error!', `Algo ha salido mal, intentalo de nuevo mas tarde`, 'error');

            //auth/email-already-in-use
        }

    }
    async getCurrentUser() { // Recoge al usuario actual si es que existe
        return this._afAuth.authState.pipe(first()).toPromise();

    }
    async sendVerificationEmail(): Promise<void> { //Eenvia el correo de verificacion de email
        try {
            return await (this._afAuth.auth.currentUser).sendEmailVerification().then(resp => {
                Swal.fire('Listo!', 'Se ha enviado el correo de verificación !!!', 'success');
                //this.createNewUser();

            }).catch(error => {
                console.log(error);
            });
        } catch (error) {
            console.log(error);
        }
    }
    async sendRecoverPasswordEmail(email: any): Promise<void> {//Envia un correo de solicitud de cambio de contraseña
        try {
            return await (this._afAuth.auth).sendPasswordResetEmail(email).then(resp => {
                Swal.fire('Listo!', `Se ha enviado un correo a  <strong>${email}</>`, 'success');

            }).catch(error => {
                console.log(error);
                Swal.fire('Error!', `No existe usuario asociado con <strong>${email}</strong>`, 'error');

            });
        } catch (error) {
            console.log(error);
        }
    }
    async recoverPassword(actionCode: any, password: any) { //verifica el codigo de accion

        return this.getAuth().verifyPasswordResetCode(actionCode).then(email => {
            console.log(email);
            //this.setNewPassword(actionCode, password);

        }).catch(error => {
            //caduco el tiempo de la peticion
            console.log(error);
            //return 'mal';
        });
    }
    async handleRecoverEmail(actionCode) { // envia un correo de solicitud de cambio de Email
    }
    async handleVerifyEmail(actionCode) { //verifica el email...
        return await (this._afAuth.auth).applyActionCode(actionCode);
    }
    sendWelcomeEmail(email): Observable<any> {// envia un email de bienivenida cuando el usuario ha sifo verificado
        // let params = JSON.stringify(email);
        return this._hhtp.get(this.url + 'sendWelcomeEmail/' + email);
    }

    sendReportedEmail(email): Observable<any> {// envia un email de bienivenida cuando el usuario ha sifo verificado
        console.log('enviando correo...');
        return this._hhtp.get(this.url + 'sendReportedEmail/' + email);
    }

    reauthentication(nowPassword,  email) {
        
        const credentials = firebase.auth.EmailAuthProvider.credential(email, nowPassword);
        return this._afAuth.auth.currentUser.reauthenticateWithCredential(credentials);

    }
    updatePasword(newPassword){
      return this._afAuth.auth.currentUser.updatePassword(newPassword);
    }

    //GUARDAR, MODIFICAR O ELIMINAR USUARIOS
    async createNewUser(data): Promise<void> {//Crea un un nuevo usuario en el documento 'users' de firestore
        //console.log(data);
        return this._afirestore.collection('users').doc(data.uid).set(data);
    }

    getUserData(uid: string) {
        return this._afirestore.collection('users').doc(uid).valueChanges();
    }

    async updateUserandSendEmail(data): Promise<void> {//Crea un un nuevo usuario en el documento 'users' de firestore
        //console.log(data);
        return this._afirestore.collection('users').doc(data.uid).set(data).then(resp => {
            this.sendWelcomeEmail(data.email).subscribe(
                Response => {
                    console.log(Response.message);
                },
                error => {
                    console.log(error);
                }
            );
        });
    }
    updateUserData(data) {

        return this._afirestore.collection('users').doc(data.uid).update(data).then(r => {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Actualizacion exitosa!',
                showConfirmButton: false,
                timer: 1500
            });
        }).catch(err => {
            Swal.fire('Error!', `Algo salio mal, intentalo mas tarde`, 'error');
        });

    }

    saveNewProfilePhoto(user, file) {

        const filepath = `images/profiles/${user.uid}/${file.name}`;
        const fileRef = this.storage.ref(filepath);
        const task = this.storage.upload(filepath, file);
        task.snapshotChanges().pipe(
            finalize(() => {
                console.log('img subida, bajando...');
                fileRef.getDownloadURL().subscribe(url => {
                    console.log(url);
                    user.photoURL = url;
                    this.updateUserData(user);
                    this._afirestore.collection('users').doc(user.uid).collection('profiles').add({url: url, date: Date.now()}).then(()=>{console.log('ultima foto guardada')});
                })
            })).subscribe();

    }

    getLastProfiles(uid){
    return this._afirestore.collection(`users/${uid}/profiles`,  ref => ref.orderBy('date', 'desc').limit(6) ).snapshotChanges().pipe(map(actions => {
      
        return actions.map(a => {
          const data = a.payload.doc.data() as any;
          data.id = a.payload.doc.id          
          return data;
        })
      }));
    }

    deleteProfilePhoto(uid, id){
        return this._afirestore.collection(`users/${uid}/profiles`).doc(`${id}`).delete().then(()=>{
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Se ha elinado la foto!',
                showConfirmButton: false,
                timer: 1500
            });
        }).catch(err => {
            Swal.fire('Error!', `Algo salio mal, intentalo mas tarde`, 'error');
        });
    }

    getList(uid, rooms){
        return this._afirestore.collection(`users/${uid}/${rooms}/`).snapshotChanges().pipe(map(actions =>{
            return actions.map (a => {
              const data = a.payload.doc.data() as Room;
              data.id = a.payload.doc.id;
              return data;
            })
        }));    }

    //NOTIFICACIONES MINIMALISTAS
    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
            duration: 3500,
        });
    }

}