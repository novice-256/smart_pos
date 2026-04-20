import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Login } from './features/login/login';
import { authGuard } from './auth.guard';
import { NotFound } from './errors/not-found/not-found';
import { Serverdown } from './errors/serverdown/serverdown';
import { Unauthorized } from './errors/unauthorized/unauthorized';
import { App } from './app';


export const routes: Routes = [
   {
    path : '' ,
    component : App, 
    children:[

        {path:'' , component: Home , canActivate :[authGuard]} ,
        {path:'login' , component: Login }
         ]
    },
        {path:'**' , component: NotFound },
        {path:'server-down' , component: Serverdown },
        {path:'unauthorized' , component: Unauthorized }
];
