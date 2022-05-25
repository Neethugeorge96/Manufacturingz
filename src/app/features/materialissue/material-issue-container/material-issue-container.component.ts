import { Component, OnInit } from '@angular/core';
import { TabAnimationSettingsModel } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'app-material-issue-container',
  templateUrl: './material-issue-container.component.html',
  
})
export class MaterialIssueContainerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  animation: TabAnimationSettingsModel = { previous: { effect: 'None' }, next: { effect: 'None' } };
  
}
