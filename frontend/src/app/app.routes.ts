import { Routes } from '@angular/router';

/*
  UNCOMMENT THIS LINE FOR CHECK IF THE RAILWAY IS WORKING BUT IT'S COMMENTED FOR NOT CONSUMING THE RAILWAY API
    import { RailwayCheckGuard } from './core/guards/railway-check.guard';
*/

export const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },

  /*
   * THIS COMMENTED LINE IS FOR CHECK IF THE RAILWAY IS WORKING BUT IT'S COMMENTED FOR NOT CONSUMING THE RAILWAY API
   * -->  { path: 'index', component: IndexComponent, canActivate: [RailwayCheckGuard] },
   */

  //{ path: 'index', component: IndexComponent },

  // IT'S OBLIGATORY TO HAVE THIS LINE AT THE END OF THE ROUTES BECAUSE IT REDIRECTS
  // TO THE INDEX PAGE IF THE URL IS NOT FOUND
  { path: '**', redirectTo: 'index' },

];
