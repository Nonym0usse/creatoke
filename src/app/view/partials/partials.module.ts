// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Modules
import { CoreModule } from './../../core/core.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

// Components
import { BrandComponent } from './brand/brand.component';
import { CarouselComponent } from './carousel/carousel.component';
import { EventViewComponent } from './components/event-view/event-view.component';
import { CoverViewComponent } from './components/cover-view/cover-view.component';
import { ListViewComponent } from './components/list-view/list-view.component';
import { CommentComponent } from './comment/comment.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { RichEditorComponent } from './rich-editor/rich-editor.component';


@NgModule({
  declarations: [
    BrandComponent,
    CarouselComponent,
    EventViewComponent,
    CoverViewComponent,
    ListViewComponent,
    CommentComponent,
    NotificationsComponent,
    ProgressBarComponent,
    RichEditorComponent,
  ],
  imports: [
    // Angular
    CommonModule,
    RouterModule,

    // Modules
    CoreModule,
    CKEditorModule
  ],
  exports: [
    // Components
    BrandComponent,
    CarouselComponent,
    EventViewComponent,
    CoverViewComponent,
    ListViewComponent,
    CommentComponent,
    NotificationsComponent,
    ProgressBarComponent,
    RichEditorComponent,
    // Modules
    CoreModule
  ]
})
export class PartialsModule { }
