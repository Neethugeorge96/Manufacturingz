import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-route-view',
  templateUrl: './route-view.component.html',
  styles: [
  ]
})
export class RouteViewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  getDate(date){
    return new Date(date+'Z');
  }

}
