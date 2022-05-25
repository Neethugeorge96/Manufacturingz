import { Component, ChangeDetectionStrategy, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { mobileNavigation } from 'src/app/store/navigation';
import { APP_CONFIG } from 'src/app/app.config';
import { MainComponent } from '../main/main.component';

@Component({
  selector: 'smart-page-header',
  templateUrl: './page-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageHeaderComponent {

  avatar = APP_CONFIG.avatar;
  email = APP_CONFIG.email;
  user = APP_CONFIG.user;

  constructor(private store: Store<any>, private viewContainerRef: ViewContainerRef) { }

  getParentComponent(): MainComponent{
    return this.viewContainerRef[ '_data' ].componentView.component.viewContainerRef[ '_view' ].component
  }
  openMobileNav($event: MouseEvent) {
    $event.preventDefault();
    this.store.dispatch(mobileNavigation({open: true}));
  }

}
