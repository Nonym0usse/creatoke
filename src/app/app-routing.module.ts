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
    loadChildren: () => import('./view/theme/theme.module').then(m => m.ThemeModule).catch((e) => console.log(e)),
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
