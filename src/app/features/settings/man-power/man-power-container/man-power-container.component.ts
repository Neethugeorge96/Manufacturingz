import { Component, OnInit } from '@angular/core';
import { TabAnimationSettingsModel } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'app-man-power-container',
  templateUrl: './man-power-container.component.html',
  styles: [
  ]
})
export class ManPowerContainerComponent implements OnInit {
  animation: TabAnimationSettingsModel = { previous: { effect: 'None' }, next: { effect: 'None' } };
  constructor() { }

  ngOnInit(): void {
  }


}
