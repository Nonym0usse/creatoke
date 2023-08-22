// Angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

// Modules
import { AppRoutingModule } from './app-routing.module';
import { PartialsModule } from './view/partials/partials.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

// Default component
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/environment';
import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings } from 'ng-recaptcha';
import { NgxPayPalModule } from 'ngx-paypal';
import {LicenceComponent} from "./view/theme/licence/licence.component";
import {CommentsAdminComponent} from "./view/theme/comments-admin/comments-admin.component";
import {BackgroundimageComponent} from "./view/theme/backgroundimage/backgroundimage.component";
import {LoaderComponent} from "./view/partials/loader/loader.component";
import { RefreshTokenService } from './core/services/global/refresh-token.service';

@NgModule({
  declarations: [
    // Default component
    AppComponent,
    LoaderComponent,
    LicenceComponent,
    CommentsAdminComponent,
    BackgroundimageComponent,
  ],
  imports: [
    // Angular
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RecaptchaModule,
    NgxPayPalModule,
    // Modules
    PartialsModule,
    CKEditorModule,
  ],
  providers: [{
    provide: RECAPTCHA_SETTINGS,
    useValue: {
      siteKey: "6LeCDVIUAAAAAP86GJ95Z-0OY8CeUaG-oEeIpYcF",
    } as RecaptchaSettings,
  }, RefreshTokenService],
  bootstrap: [AppComponent]
})
export class AppModule { }
