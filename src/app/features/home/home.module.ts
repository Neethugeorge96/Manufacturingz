import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { InboxComponent } from './inbox/inbox.component';

@NgModule({
  declarations: [
    DashboardComponent, 
    InboxComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { 
        path: '', 
        pathMatch: 'full', 
        redirectTo: 'introduction' 
      },
      {
        path: 'dashboard', 
        component: DashboardComponent,
        data: { breadcrumbs: ['Dashboard'] }
      },
      {
        path: 'inbox', 
        component: InboxComponent,
        data: { breadcrumbs: ['Inbox'] }
      }
    ])
  ]
})
export class HomeModule { }
