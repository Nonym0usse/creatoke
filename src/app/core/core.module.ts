// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// NPM modules
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { SwiperModule } from 'swiper/angular';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgChartsModule } from 'ng2-charts';

// Services
import { AuthGuard } from './services/global/auth-guard.service';
import { InterceptorService } from './services/global/interceptor.service';

// Directives
import { ValidationDirective } from './directives/validation.directive';
import { TabsDirective } from './directives/tabs.directive';

// Perfect scrollbar global config
const SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelSpeed: 2,
  suppressScrollX: true,
  swipeEasing: true,
  wheelPropagation: false,
  minScrollbarLength: 40
};


@NgModule({
  declarations: [
    ValidationDirective,
    TabsDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    // Angular
    FormsModule,
    ReactiveFormsModule,

    // NPM modules
    PerfectScrollbarModule,
    SwiperModule,
    NgxDropzoneModule,
    NgChartsModule,

    // Directives
    ValidationDirective,
    TabsDirective
  ],
  providers: [
    AuthGuard,
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: InterceptorService, 
      multi: true 
    },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: SCROLLBAR_CONFIG
    }
  ]
})
export class CoreModule { }
