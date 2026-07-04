// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// Modules
import { LayoutModule } from '../layout/layout.module';

// Components
import { ThemeComponent } from './theme.component';
import { HomeComponent } from './home/home.component';
import { AddSongComponent } from './song/add-song/add-song.component';
import { AnalyticsComponent } from './user/analytics/analytics.component';
import { MusicComponent } from './music/music.component';
import { MusicViewComponent } from './music/music-view/music-view.component';
import { ConfirmPurchaseComponent } from './confirm/confirm-purchase.component';
import { ContactComponent } from './contact/contact.component';
import { ManageComponent } from './music/manage/manage.component';
import { ModifyComponent } from './music/modify/modify.component';
import { RecaptchaModule } from "ng-recaptcha";
import { CKEditorModule } from 'ngx-ckeditor';
import { NgxPayPalModule } from "ngx-paypal";
import { LicenceComponent } from "./licence/licence.component";
import { AuthGuard } from "../../core/services/global/auth-guard.service";
import { LoginComponent } from "../pages/auth/login/login.component";
import { EditextComponent } from './editext/editext.component';
import { CommentsAdminComponent } from "./comments-admin/comments-admin.component";
import { BackgroundimageComponent } from "./backgroundimage/backgroundimage.component";
import { AboutComponent } from './about/about.component';
import { RgpdComponent } from './rgpd/rgpd.component';
import { LicenceContractsComponent } from './licence-contracts/licence-contracts.component';
import { ProspectsComponent } from './prospects/prospects.component';
import { PublishVideoComponent } from './publish-video/publish-video.component';
import { ModalComponent } from '../partials/modal/modal.component';

//
// Theme routes
const routes: Routes = [
  {
    path: '',
    component: ThemeComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      { path: "song/:category", component: MusicComponent },
      { path: "song/:category/:slug", component: MusicViewComponent },
      {
        path: 'confirm-purchase',
        component: ConfirmPurchaseComponent
      },
      {
        path: 'add-song',
        component: AddSongComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'analytics',
        component: AnalyticsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'licence',
        component: LicenceComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'comments',
        component: CommentsAdminComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'contact',
        component: ContactComponent
      },
      {
        path: 'about',
        component: AboutComponent
      },
      {
        path: 'rgpd',
        component: RgpdComponent
      },
      {
        path: 'contrats-licence',
        component: LicenceContractsComponent
      },
      {
        path: 'manage',
        component: ManageComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'modify-song/:slug',
        component: ModifyComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'image-background',
        component: BackgroundimageComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'text-accueil',
        component: EditextComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'publish-video',
        component: PublishVideoComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'prospects',
        component: ProspectsComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  declarations: [
    ThemeComponent,
    HomeComponent,
    ModifyComponent,
    ConfirmPurchaseComponent,
    AnalyticsComponent,
    LoginComponent,
    AddSongComponent,
    MusicComponent,
    AboutComponent,
    RgpdComponent,
    LicenceContractsComponent,
    ProspectsComponent,
    MusicViewComponent,
    ContactComponent,
    ManageComponent,
    EditextComponent,
    ModalComponent,
  ],
  imports: [
    // Angular
    CommonModule,

    // Modules
    LayoutModule,

    // Import router module
    RouterModule.forChild(routes),
    RecaptchaModule,
    CKEditorModule,
    NgxPayPalModule,
  ],
  exports: [
    ModalComponent
  ]
})
export class ThemeModule { }
