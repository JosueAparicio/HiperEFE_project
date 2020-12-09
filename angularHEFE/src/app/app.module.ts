import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { routing, appRoutingProviders } from './app.routing';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material/material.module';
import {MatNativeDateModule} from '@angular/material/core';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import { PickerModule } from '@ctrl/ngx-emoji-mart';


import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { SliderComponent } from './components/slider/slider.component';
import { ErrorComponent } from './components/error/error.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { VerificarEmailComponent } from './components/verificar-email/verificar-email.component';
import { GeneralValidationsComponent } from './components/general-validations/general-validations.component';
import { TermsconditionsComponent } from './components/termsconditions/termsconditions.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogExampleComponent } from './components/dialogs/dialog-example/dialog-example.component';
import { SceneComponent } from './components/vr/lobby/scene/scene.component';
import { AssetsComponent } from './components/vr/lobby/assets/assets.component';
import { CardOptionComponent } from './components/vr/lobby/card-option/card-option.component';
import { SalasComponent } from './components/salas/salas.component';
import { SalaComponent } from './components/sala/sala.component';
import { RoomComponent } from './components/dialogs/room/room.component';
import { UserConfigComponent } from './components/dialogs/user-config/user-config.component';
import { ChatsComponent } from './components/chats/chats.component';
import { DetailsRoomComponent } from './components/details-room/details-room.component';
import { MessagesComponent } from './components/chats/messages/messages.component';
import { ConversationsComponent } from './components/chats/conversations/conversations.component';
import { ProfileComponent } from './components/profile/profile.component';
import { GeneralComponent } from './components/profile/general/general.component';
import { AccessComponent } from './components/profile/access/access.component';
import { OthersComponent } from './components/profile/others/others.component';
import { SceneMuseumComponent } from './components/vr/museum/scene-museum/scene-museum.component';
import { AssetsMuseumComponent } from './components/vr/museum/assets-museum/assets-museum.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { PreguntasfreqComponent } from './components/preguntasfreq/preguntasfreq.component';
import { AyudaComponent } from './components/ayuda/ayuda.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    SliderComponent,
    ErrorComponent,
    SidebarComponent,
    InicioComponent,
    VerificarEmailComponent,
    GeneralValidationsComponent,
    TermsconditionsComponent,
    DialogExampleComponent,
    SceneComponent,
    AssetsComponent,
    CardOptionComponent,
    SalasComponent,
    SalaComponent,
    RoomComponent,
    UserConfigComponent,
    ChatsComponent,
    DetailsRoomComponent,
    MessagesComponent,
    ConversationsComponent,
    ProfileComponent,
    GeneralComponent,
    AccessComponent,
    OthersComponent,
    SceneMuseumComponent,
    AssetsMuseumComponent,
    PreguntasfreqComponent,
    AyudaComponent
  ],
  imports: [
    BrowserModule,
    routing,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
    SweetAlert2Module,
    BrowserAnimationsModule,
    MaterialModule,
    MatNativeDateModule,
    PickerModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  entryComponents: [
    DialogExampleComponent, 
    RoomComponent,
    UserConfigComponent],
  providers: [appRoutingProviders, { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }

