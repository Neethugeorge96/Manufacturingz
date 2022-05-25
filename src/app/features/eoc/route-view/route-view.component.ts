import { Component, Input, OnInit } from '@angular/core';
import { GenericRoutingService } from '@features/routing/genericroutingmaster/generic-routing.service';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { EocService } from '../eoc.service';

@Component({
  selector: 'app-route-view',
  templateUrl: './route-view.component.html'
})
export class RouteViewComponent implements OnInit {

  @Input() route:any;

  constructor() { }

  ngOnInit(): void {
    console.log("route",this.route)
  }

}
