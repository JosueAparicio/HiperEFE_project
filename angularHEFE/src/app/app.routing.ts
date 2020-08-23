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


const appRoutes: Routes =[
    { path: '', component: InicioComponent },
    { path: 'inicio', component: InicioComponent },
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'home', component: HomeComponent},
    { path: 'verify-account/:uid', component: VerificarEmailComponent},
    { path: 'user/general-validations', component:GeneralValidationsComponent},
    { path: 'terms-and-conditions', component: TermsconditionsComponent},
    { path: '**', component: ErrorComponent}

];

//exportar el modulo de rutas
export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);


