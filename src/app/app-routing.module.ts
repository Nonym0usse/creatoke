// Angular
import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';

// Services
import { AuthGuard } from './core/services/global/auth-guard.service';


//
// Initial routes
const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./view/pages/pages.module').then(m => m.PagesModule)
  },
  {
    path: 'app',
    loadChildren: () => import('./view/theme/theme.module').then(m => m.ThemeModule),
    canActivate: [AuthGuard],
    canLoad: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '404'
  },
];

const routeOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
  onSameUrlNavigation: 'reload'
};

@NgModule({
  imports: [
    RouterModule.forRoot(routes, routeOptions)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
