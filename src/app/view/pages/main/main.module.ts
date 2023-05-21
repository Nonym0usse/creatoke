// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// Modules
import { LayoutModule } from '../../layout/layout.module';

// Components
import { MainComponent } from './main.component';
import { LandingComponent } from './landing/landing.component';
import { AboutComponent } from './about/about.component';
import { BlogComponent } from './blog/blog.component';
import { BlogDetailsComponent } from './blog/blog-details/blog-details.component';
import { ContactComponent } from './contact/contact.component';


//
// Main routes
const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: 'landing'
      },
      {
        path: 'landing',
        component: LandingComponent
      },
      {
        path: 'about',
        component: AboutComponent
      },
      {
        path: 'blog',
        component: BlogComponent
      },
      {
        path: 'blog/:id/details',
        component: BlogDetailsComponent
      },
      {
        path: 'contact',
        component: ContactComponent
      }
    ]
  },
  
];


@NgModule({
  declarations: [
    MainComponent,
    LandingComponent,
    AboutComponent,
    BlogComponent,
    BlogDetailsComponent,
    ContactComponent
  ],
  imports: [
    // Angular
    CommonModule,

    // Modules
    LayoutModule,

    // Import router module
    RouterModule.forChild(routes)
  ]
})
export class MainModule { }
