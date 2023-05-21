// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// Modules
import { CoreModule } from './../../core/core.module';

// Components
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ErrorComponent } from './auth/error/error.component';


//
// Page routes
const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: '404',
    component: ErrorComponent
  },
  {
    path: '',
    loadChildren: () => import('./main/main.module').then(m => m.MainModule)
  }
];


@NgModule({
  declarations: [
    // Components
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ErrorComponent
  ],
  imports: [
    // Angular
    CommonModule,

    // Modules
    CoreModule,

    // Import router module
    RouterModule.forChild(routes)
  ]
})
export class PagesModule { }
