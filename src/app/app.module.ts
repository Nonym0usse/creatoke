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
import { RECAPTCHA_SETTINGS, RecaptchaModule, RecaptchaSettings } from 'ng-recaptcha';
import { NgxPayPalModule } from 'ngx-paypal';
import {LicenceComponent} from "./view/theme/licence/licence.component";
import {CommentsAdminComponent} from "./view/theme/comments-admin/comments-admin.component";
import {BackgroundimageComponent} from "./view/theme/backgroundimage/backgroundimage.component";
import {LoaderComponent} from "./view/partials/loader/loader.component";
import { PublishVideoComponent } from './view/theme/publish-video/publish-video.component';

@NgModule({
  declarations: [
    // Default component
    AppComponent,
    LoaderComponent,
    LicenceComponent,
    CommentsAdminComponent,
    BackgroundimageComponent,
    PublishVideoComponent,
  ],
  imports: [
    // Angular
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
      siteKey: "6LfEm00sAAAAANnaXvg8zZXZHjFHeIwd2XiW2sUh",
    } as RecaptchaSettings,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
