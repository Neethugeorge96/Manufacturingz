import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GenericRoutingService } from '@features/routing/genericroutingmaster/generic-routing.service';

@Component({
  selector: 'app-po-route-view',
  templateUrl: './po-route-view.component.html',
  styles: [
  ]
})
export class PORouteViewComponent implements OnInit, OnChanges {
  @Input() route;
  routeFromApi;
  constructor(private genericRoutingService: GenericRoutingService) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.genericRoutingService.get(this.route.routingId).subscribe(res=>{
      this.routeFromApi = res;
    });
  }

  ngOnInit(): void {
    // this.genericRoutingService.get()
  }
  

}
