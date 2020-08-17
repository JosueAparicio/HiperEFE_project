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





@Injectable()
export class UserService {

    public user: User;

    constructor(public _afAuth: AngularFireAuth, private _router: Router, private _afirestore: AngularFirestore) {

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
            console.log(error);
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
    async createAccount(data) { //crear una cuenta nueva
        try {
            const result = await this._afAuth.auth.createUserWithEmailAndPassword(data.email, data.password).then(async resp =>{
                this.createNewUser(data);
                this._router.navigate(['verificar-cuenta/' + this._afAuth.auth.currentUser.uid]);
                this.sendVerificationEmail();
            }).catch( error =>{
                console.log(error);
                if (error.code == 'auth/email-already-in-use'){
                    Swal.fire('Error!',  `Ya existe un usuario registrado con <strong>${data.email}</strong>`, 'error');
                }
            });
            
            return result;

        }
        catch (error) {
            console.log(error);
            Swal.fire('Error!',  `Algo ha salido mal, intentalo de nuevo mas tarde`, 'error');

            //auth/email-already-in-use
        }

    }
    async getCurrentUser() { // Recoge al usuario actual si es que existe
        return this._afAuth.authState.pipe(first()).toPromise();
    }
    async sendVerificationEmail(): Promise<void> { //Eenvia el correo de verificacion de email
        try {
            return await (this._afAuth.auth.currentUser).sendEmailVerification().then (resp =>{
                Swal.fire('Listo!', 'Se ha enviado el correo de verificación !!!', 'success');
                //this.createNewUser();
                
            }).catch(error =>{
                console.log(error);
            });
        } catch (error) {
            console.log(error);
        }
    }
    async sendRecoverPasswordEmail(email: any): Promise<void> {//Envia un correo de solicitud de cambio de contraseña
        try {
            return await (this._afAuth.auth).sendPasswordResetEmail(email).then ( resp => {
                Swal.fire('Listo!',  `Se ha enviado un correo a  <strong>${email}</>`, 'success');

            }). catch (error =>{
                console.log(error);
                Swal.fire('Error!',  `No existe usuario asociado con <strong>${email}</strong>`, 'error');

            });
        } catch (error) {
            console.log(error);
        }
    }
    async recoverPassword(actionCode: any, password: any) { //verifica el codigo de accion

       return this.getAuth().verifyPasswordResetCode(actionCode).then( email=> {
            console.log(email);
            //this.setNewPassword(actionCode, password);
            
        }).catch(error=> {
            //caduco el tiempo de la peticion
            console.log(error);
            //return 'mal';
        });
    }
    async handleRecoverEmail(actionCode) { // envia un correo de solicitud de cambio de Email
    }
    async handleVerifyEmail(actionCode) { //envia un correo de solicitud de verificacion del Email
        return await (this._afAuth.auth).applyActionCode(actionCode);
    }


    //GUARDAR, MODIFICAR O ELIMINAR USUARIOS
    async createNewUser(data) {//Crea un un nuevo usuario en el documento 'users' de firestore
        const Fulldata = {
            uid: this._afAuth.auth.currentUser.uid,
            displayName: data.displayName,
            photoURL: this._afAuth.auth.currentUser.photoURL,
            email: data.email,
            date: data.date,
            previousConc: ''
        }
        const resp= (await this._afirestore.collection('users').doc(Fulldata.uid).set(Fulldata));
        console.log('creado');
        return resp;
        

    }

    
}