import { Injectable } from "@angular/core";
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { first } from 'rxjs/operators';
import { User } from 'firebase';
import { async } from 'rxjs/internal/scheduler/async';
import Swal from 'sweetalert2';
import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Global } from './global';
import { UserModel } from '../models/user-model.model';



@Injectable()
export class UserService {

    public user: User;
    public url: string;

    constructor(public _afAuth: AngularFireAuth, private _router: Router, private _afirestore: AngularFirestore, private _hhtp: HttpClient) {
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
            return this._afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()).then(resp => {
                this._router.navigate(['/home'])
                //console.log(resp.user);
                /*   const {uid, displayName, email, photoURL} = resp.user;
                   const dataUser= { 
                       uid,
                       displayName,
                       email,
                       photoURL,
                       date: null,
                       cuenta:null,
                       conocimiento:null
                   }
                   this.createNewUser(dataUser);
   

                this.sendWelcomeEmail(resp.user.email).subscribe(
                    Response => {
                        console.log(Response.message);

                    },
                    error => {
                        console.log(error);

                    }
                );
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
                    conocimiento: null
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

    //GUARDAR, MODIFICAR O ELIMINAR USUARIOS
    async createNewUser(data): Promise<void> {//Crea un un nuevo usuario en el documento 'users' de firestore
        console.log(data);
        return this._afirestore.collection('users').doc(data.uid).set(data).then();
    }


}