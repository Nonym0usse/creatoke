// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Modules
import { CoreModule } from './../../core/core.module';

// Components
import { BrandComponent } from './brand/brand.component';
import { CarouselComponent } from './carousel/carousel.component';
import { EventViewComponent } from './components/event-view/event-view.component';
import { CoverViewComponent } from './components/cover-view/cover-view.component';
import { ListViewComponent } from './components/list-view/list-view.component';
import { CommentComponent } from './comment/comment.component';
import { MusicDetailsComponent } from '../theme/music/music-details/music-details.component';


@NgModule({
  declarations: [
    BrandComponent,
    CarouselComponent,
    EventViewComponent,
    CoverViewComponent,
    MusicDetailsComponent,
    ListViewComponent,
    CommentComponent,
  ],
  imports: [
    // Angular
    CommonModule,
    RouterModule,

    // Modules
    CoreModule
  ],
  exports: [
    // Components
    BrandComponent,
    CarouselComponent,
    EventViewComponent,
    CoverViewComponent,
    ListViewComponent,
    MusicDetailsComponent,
    CommentComponent,
    // Modules
    CoreModule
  ]
})
export class PartialsModule { }
