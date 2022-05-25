import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { mobileNavigation } from './../../../store/navigation';
import { APP_CONFIG } from './../../../app.config';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './../../../services/auth/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'smart-main',
  templateUrl: './main.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class MainComponent implements OnInit {

  app = APP_CONFIG.app;
  isLoggedIn: boolean;
  isAtAuth: boolean;
  constructor(private store: Store<any>,
     private router: Router, private authService: AuthService) {
    
   }
   ngOnInit(){
    // this.isLoggedIn = this.authService.isLoggedIn()
    this.isLoggedIn = true;
    this.isAtAuth = false;
    // this.isAtAuth = this.router.url.startsWith('/auth')
    this.router.events.pipe(filter(event=> event instanceof NavigationEnd))
    .subscribe(res=>{
      // this.isAtAuth = this.router.url.startsWith('/auth')
    })
    

   }
 

  closeMobileNav($event: MouseEvent) {
    $event.preventDefault();
    this.store.dispatch(mobileNavigation({open: false}));
  }

}
