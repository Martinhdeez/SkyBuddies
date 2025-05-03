import { Routes } from '@angular/router';
import {IndexComponent} from './features/index/index.component';
import {RegisterComponent} from './features/auth/register/register.component';
import {LoginComponent} from './features/auth/login/login.component';
import {HomeComponent} from './features/home/home.component';
import {ChatComponent} from './features/chat/chat.component';
import {AuthGuard} from './core/guards/auth.guard';

/*
  UNCOMMENT THIS LINE FOR CHECK IF THE RAILWAY IS WORKING BUT IT'S COMMENTED FOR NOT CONSUMING THE RAILWAY API
    import { RailwayCheckGuard } from './core/guards/railway-check.guard';
*/

export const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },

  /*
   * THIS COMMENTED LINE IS FOR CHECK IF THE RAILWAY IS WORKING BUT IT'S COMMENTED FOR NOT CONSUMING THE RAILWAY API
   * -->  { path: 'index', component: HomeComponent, canActivate: [RailwayCheckGuard] },
   */

  { path: 'index', component: IndexComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'users/chat', component: ChatComponent },
  // IT'S OBLIGATORY TO HAVE THIS LINE AT THE END OF THE ROUTES BECAUSE IT REDIRECTS
  // TO THE INDEX PAGE IF THE URL IS NOT FOUND
  { path: '**', redirectTo: 'index' },

];
