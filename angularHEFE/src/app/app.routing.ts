//importamos los modulos de router de angular para navegar entre los doferentes componentes
import { ModuleWithProviders, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


//se importan los elementos a los que se las hará una pagina exclusiva
import { ErrorComponent } from './components/error/error.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { VerificarEmailComponent } from './components/verificar-email/verificar-email.component';
import { GeneralValidationsComponent } from './components/general-validations/general-validations.component';
import { TermsconditionsComponent } from './components/termsconditions/termsconditions.component';
import { SceneComponent } from './components/vr/lobby/scene/scene.component';
import { DetailsRoomComponent } from './components/details-room/details-room.component';
import { ChatsComponent } from './components/chats/chats.component';
import { ProfileComponent } from './components/profile/profile.component';


const appRoutes: Routes =[
    { path: '', component: InicioComponent },
    { path: 'inicio', component: InicioComponent },
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'home', component: HomeComponent},
    { path: 'verify-account/:uid', component: VerificarEmailComponent},
    { path: 'user/general-validations', component:GeneralValidationsComponent},
    { path: 'terms-and-conditions', component: TermsconditionsComponent},
    { path: 'vr/lobby', component: SceneComponent},
    { path: 'detailsRoom/:creator/:codeRoom', component: DetailsRoomComponent},
    { path: 'rooms/chats', component: ChatsComponent},
    { path: 'user/profile/:uid', component: ProfileComponent},
    { path: '**', component: ErrorComponent}

];

//exportar el modulo de rutas
export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);


