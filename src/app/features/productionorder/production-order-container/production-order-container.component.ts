import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { SelectEventArgs, TabAnimationSettingsModel, TabComponent } from '@syncfusion/ej2-angular-navigations';
import { filter, pairwise } from 'rxjs/operators';
import { POheader } from '../productionorder.model';
import { ProductionorderService } from '../productionorder.service';

@Component({
  selector: 'app-production-order-container',
  templateUrl: './production-order-container.component.html'
})
export class ProductionOrderContainerComponent implements OnInit, AfterViewInit {
  @ViewChild('tab') tab: TabComponent;
  routingId: number;
  productionOrder: POheader;
  animation: TabAnimationSettingsModel = { previous: { effect: 'None' }, next: { effect: 'None' } };
  productionorderHeader: string = "Add Planned Production Order";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productionorderservice: ProductionorderService,
  ) { }

  ngOnInit(): void {
    this.routingId = Number(this.route.snapshot.paramMap.get('id'));
    this.router.events
      .pipe(
        filter((e: any) => e instanceof RoutesRecognized),
        pairwise(),
      ).subscribe((events: RoutesRecognized[]) => {
        // console.log('previous url', events[0].urlAfterRedirects);
        // console.log('current url', events[1].urlAfterRedirects);
        // console.log(this.routingId, 'url id');
        if (events[0].urlAfterRedirects === '/productionOrder/production-order-list/create' &&
          events[1].urlAfterRedirects.startsWith('/productionOrder/production-order-list/')) {
          // console.log('url here', this.tab);
          this.tab.select(1);
        }
      });


    if (this.routingId) {
      this.productionorderHeader= "Edit Planned Production Order";
      this.productionorderservice.get(this.routingId).subscribe(res => {
        this.productionOrder = res;
      });
    }

  }
  ngAfterViewInit() {
    // this.tab.enableTab(1, true);
    // this.tab.removeTab(1);
  }
  selectTab(index) {
    this.tab.select(index);
  }
  public tabSelected(e: SelectEventArgs): void {
    if (e.isSwiped) {
      e.cancel = true;
    }
  }

}
