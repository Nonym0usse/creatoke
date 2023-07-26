// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// Modules
import { LayoutModule } from '../layout/layout.module';

// Components
import { ThemeComponent } from './theme.component';
import { HomeComponent } from './home/home.component';
import { GenreComponent } from './genre/genre.component';
import { GenreDetailsComponent } from './genre/genre-details/genre-details.component';
import { SongComponent } from './song/song.component';
import { SongDetailsComponent } from './song/song-details/song-details.component';
import { AddSongComponent } from './song/add-song/add-song.component';
import { AlbumComponent } from './album/album.component';
import { AlbumDetailsComponent } from './album/album-details/album-details.component';
import { ArtistComponent } from './artist/artist.component';
import { ArtistDetailsComponent } from './artist/artist-details/artist-details.component';
import { AnalyticsComponent } from './user/analytics/analytics.component';
import { FavoriteComponent } from './user/favorite/favorite.component';
import { HistoryComponent } from './user/history/history.component';
import { ProfileComponent } from './user/profile/profile.component';
import { SettingsComponent } from './user/settings/settings.component';
import { PlanComponent } from './user/plan/plan.component';
import { CategoryComponent } from './category/category.component';
import { MusicComponent } from './music/music.component';
import { MusicDetailsComponent } from './music/music-details/music-details.component';
import { MusicViewComponent } from './music/music-view/music-view.component';
import { ContactComponent } from './contact/contact.component';
import { TextsComponent } from './texts/texts.component';
import { ManageComponent } from './music/manage/manage.component';
import { ModifyComponent } from './music/modify/modify.component';
import {RecaptchaModule} from "ng-recaptcha";
import {CKEditorModule} from "@ckeditor/ckeditor5-angular";
import {NgxPayPalModule} from "ngx-paypal";
import {LicenceComponent} from "./licence/licence.component";


//
// Theme routes
const routes: Routes = [
  {
    path: '',
    component: ThemeComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'song/:category',
        component: MusicComponent
      },
      {
        path: 'song/:category/:id',
        component: MusicDetailsComponent
      },
      {
        path: 'song/:category/:id/:detail/view',
        component: MusicViewComponent
      },
      {
        path: 'add-song',
        component: AddSongComponent
      },
      {
        path: 'album',
        component: AlbumComponent
      },
      {
        path: 'album/:id/details',
        component: AlbumDetailsComponent
      },
      {
        path: 'artist',
        component: ArtistComponent
      },
      {
        path: 'artist/:id/details',
        component: ArtistDetailsComponent
      },
      {
        path: 'analytics',
        component: AnalyticsComponent
      },
      {
        path: 'licence',
        component: LicenceComponent
      },
      {
        path: 'category',
        component: CategoryComponent
      },
      {
        path: 'contact',
        component: ContactComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'settings',
        component: SettingsComponent
      },
      {
        path: 'manage',
        component: ManageComponent
      },
      {
        path: 'modify-song/:id',
        component: ModifyComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    ThemeComponent,
    HomeComponent,
    GenreComponent,
    GenreDetailsComponent,
    SongComponent,
    SongDetailsComponent,
    AlbumComponent,
    AlbumDetailsComponent,
    ArtistComponent,
    ArtistDetailsComponent,
    AnalyticsComponent,
    FavoriteComponent,
    HistoryComponent,
    ProfileComponent,
    SettingsComponent,
    PlanComponent,
    AddSongComponent,
    CategoryComponent,
    MusicComponent,
    MusicDetailsComponent,
    MusicViewComponent,
    ContactComponent,
    TextsComponent,
    ManageComponent,
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
    ]
})
export class ThemeModule { }
