import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';

import {
    LoginGuardGuard,
    AdminGuard,
    VerificaTokenGuard
} from '../services/services.index';
import { ProfileComponent } from './profile/profile.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { HospitalComponent } from './hospital/hospital.component';
import { MedicosComponent } from './medicos/medicos.component';
import { MedicoComponent } from './medicos/medico.component';
import { BusquedaComponent } from './busqueda/busqueda.component';

const pagesRoutes: Routes = [
    { 
        path: 'dashboard', 
        canActivate:[VerificaTokenGuard],
        component: DashboardComponent, 
        data: { titulo: 'Dashboard' } 
    },
    { path: 'progress', component: ProgressComponent, data: { titulo: 'Progress' } },
    { path: 'graficas1', component: Graficas1Component, data: { titulo: 'Graficas' } },
    { path: 'promesas', component: PromesasComponent, data: { titulo: 'Promesas' } },
    { path: 'profile', component: ProfileComponent, data: { titulo: 'Perfil de usuario' } },
    { path: 'rxjs', component: RxjsComponent, data: { titulo: 'Rxjs' } },
    { path: 'account-settings', component: AccountSettingsComponent, data: { titulo: 'Account Settings' } },
    { path: 'busqueda/:termino', component: BusquedaComponent, data: { titulo: 'Busqueda' } },

    //Matenimientos
    {
        path: 'usuarios',
        canActivate: [AdminGuard],
        component: UsuariosComponent,
        data: { titulo: 'Listado de Usuarios' }
    },
    { path: 'hospitales', component: HospitalComponent, data: { titulo: 'Listado de Hospitales' } },
    { path: 'medicos', component: MedicosComponent, data: { titulo: 'Listado de Medicos' } },
    //{path:'medico',component:MedicoComponent, data:{titulo:'Informacion Medico'}},
    { path: 'medico/:id', component: MedicoComponent, data: { titulo: 'Informacion Medico' } },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];

export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);