import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, } from '@angular/router';
import { TabAnimationSettingsModel, TabComponent } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'app-time-sheet-container',
  templateUrl: './time-sheet-container.component.html'
})
export class TimeSheetContainerComponent implements OnInit {
  @ViewChild('tab') tab: TabComponent;
  animation: TabAnimationSettingsModel = { previous: { effect: 'None' }, next: { effect: 'None' } };
pOrderId:number;

  constructor( private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.pOrderId = Number(this.route.snapshot.paramMap.get('id'));
  }

}
