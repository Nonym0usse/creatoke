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
import { NgxPayPalModule } from "ngx-paypal";
import { LicenceComponent } from "./licence/licence.component";
import { AuthGuard } from "../../core/services/global/auth-guard.service";
import { LoginComponent } from "../pages/auth/login/login.component";
import { ForgotPasswordComponent } from "../pages/auth/forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "../pages/auth/reset-password/reset-password.component";
import { EditextComponent } from './editext/editext.component';
import { CommentsAdminComponent } from "./comments-admin/comments-admin.component";
import { BackgroundimageComponent } from "./backgroundimage/backgroundimage.component";
import { AboutComponent } from './about/about.component';
import { RgpdComponent } from './rgpd/rgpd.component';
import { LicenceContractsComponent } from './licence-contracts/licence-contracts.component';
import { ProspectsComponent } from './prospects/prospects.component';
import { PublishVideoComponent } from './publish-video/publish-video.component';
import { ModalComponent } from '../partials/modal/modal.component';
import { HelpComponent } from './help/help.component';
import { AdminHelpComponent } from './help/admin-help.component';
import { ChatgptComponent } from './chatgpt/chatgpt.component';

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
      { path: "song/:category", component: MusicComponent, data: { seo: { dynamic: true } } },
      { path: "song/:category/:slug", component: MusicViewComponent, data: { seo: { dynamic: true } } },
      {
        path: 'confirm-purchase',
        component: ConfirmPurchaseComponent,
        data: { seo: { noindex: true } }
      },
      {
        path: 'add-song',
        component: AddSongComponent,
        canActivate: [AuthGuard],
        data: { seo: { noindex: true } }
      },
      {
        path: 'analytics',
        component: AnalyticsComponent,
        canActivate: [AuthGuard],
        data: { seo: { noindex: true } }
      },
      {
        path: 'licence',
        component: LicenceComponent,
        canActivate: [AuthGuard],
        data: { seo: { noindex: true } }
      },
      {
        path: 'comments',
        component: CommentsAdminComponent,
        canActivate: [AuthGuard],
        data: { seo: { noindex: true } }
      },
      {
        path: 'contact',
        component: ContactComponent,
        data: { seo: { description: "Une question, un projet musical ou une demande de licence ? Écrivez à l'équipe Créatoké depuis le formulaire de contact." } }
      },
      {
        path: 'about',
        component: AboutComponent,
        data: { seo: { description: 'Mentions légales du site Créatoké : éditeur, hébergement, propriété intellectuelle, données personnelles et cookies.' } }
      },
      {
        path: 'rgpd',
        component: RgpdComponent,
        data: { seo: { description: 'Politique de confidentialité de Créatoké : données collectées, finalités, destinataires, durée de conservation et vos droits.' } }
      },
      {
        path: 'contrats-licence',
        component: LicenceContractsComponent,
        data: { seo: { description: "Contrats de licence Créatoké pour les formats MP3 et WAV : droits accordés, usages autorisés et conditions d'utilisation des musiques." } }
      },
      {
        path: 'aide',
        component: HelpComponent,
        data: { seo: { description: 'Comment utiliser Créatoké : découvrir le catalogue, écouter, choisir une licence, acheter et télécharger vos musiques.' } }
      },
      {
        path: 'aide-admin',
        component: AdminHelpComponent,
        canActivate: [AuthGuard],
        data: { seo: { noindex: true } }
      },
      {
        path: 'chatgpt',
        component: ChatgptComponent,
        canActivate: [AuthGuard],
        data: { seo: { noindex: true } }
      },
      {
        path: 'manage',
        component: ManageComponent,
        canActivate: [AuthGuard],
        data: { seo: { noindex: true } }
      },
      {
        path: 'modify-song/:slug',
        component: ModifyComponent,
        canActivate: [AuthGuard],
        data: { seo: { noindex: true } }
      },
      {
        path: 'login',
        component: LoginComponent,
        data: { seo: { noindex: true } }
      },
      {
        path: 'mot-de-passe-oublie',
        component: ForgotPasswordComponent,
        data: { seo: { title: 'Mot de passe oublié | Creatoke', noindex: true } }
      },
      {
        path: 'nouveau-mot-de-passe',
        component: ResetPasswordComponent,
        data: { seo: { title: 'Nouveau mot de passe | Creatoke', noindex: true } }
      },
      {
        path: 'image-background',
        component: BackgroundimageComponent,
        canActivate: [AuthGuard],
        data: { seo: { noindex: true } }
      },
      {
        path: 'text-accueil',
        component: EditextComponent,
        canActivate: [AuthGuard],
        data: { seo: { noindex: true } }
      },
      {
        path: 'publish-video',
        component: PublishVideoComponent,
        canActivate: [AuthGuard],
        data: { seo: { noindex: true } }
      },
      {
        path: 'prospects',
        component: ProspectsComponent,
        canActivate: [AuthGuard],
        data: { seo: { noindex: true } }
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
    ForgotPasswordComponent,
    ResetPasswordComponent,
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
    HelpComponent,
    AdminHelpComponent,
    ChatgptComponent,
  ],
  imports: [
    // Angular
    CommonModule,

    // Modules
    LayoutModule,

    // Import router module
    RouterModule.forChild(routes),
    RecaptchaModule,
    NgxPayPalModule,
  ],
  exports: [
    ModalComponent
  ]
})
export class ThemeModule { }
