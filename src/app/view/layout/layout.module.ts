// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Modules
import { PartialsModule } from '../partials/partials.module';

// Components
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PlayerComponent } from './player/player.component';
import { ArtistCarouselComponent } from './artist-carousel/artist-carousel.component';
import { SearchComponent } from './search/search.component';
import { TotalUsersComponent } from './charts/total-users/total-users.component';
import { TotalSongsComponent } from './charts/total-songs/total-songs.component';
import { PurchasesComponent } from './charts/purchases/purchases.component';
import { StatisticsComponent } from './charts/statistics/statistics.component';


@NgModule({
  declarations: [
    // Components
    HeaderComponent,
    SidebarComponent,
    PlayerComponent,
    ArtistCarouselComponent,
    SearchComponent,
    TotalUsersComponent,
    TotalSongsComponent,
    PurchasesComponent,
    StatisticsComponent
  ],
  imports: [
    // Angular
    CommonModule,
    RouterModule,

    // Modules
    PartialsModule
  ],
  exports: [
    // Components
    HeaderComponent,
    SidebarComponent,
    PlayerComponent,
    ArtistCarouselComponent,
    TotalUsersComponent,
    TotalSongsComponent,
    PurchasesComponent,
    StatisticsComponent,


    // Modules
    PartialsModule
  ]
})
export class LayoutModule { }
