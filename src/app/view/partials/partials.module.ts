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
import { DropdownComponent } from './dropdown/dropdown.component';
import { ListViewComponent } from './components/list-view/list-view.component';
import { ClusterViewComponent } from './components/cluster-view/cluster-view.component';
import { CommentComponent } from './comment/comment.component';
import { SettingsComponent } from './settings/settings.component';


@NgModule({
  declarations: [
    BrandComponent,
    CarouselComponent,
    EventViewComponent,
    CoverViewComponent,
    DropdownComponent,
    ListViewComponent,
    ClusterViewComponent,
    CommentComponent,
    SettingsComponent
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
    DropdownComponent,
    ListViewComponent,
    ClusterViewComponent,
    CommentComponent,
    SettingsComponent,

    // Modules
    CoreModule
  ]
})
export class PartialsModule { }
