import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SelectEventArgs, TabAnimationSettingsModel, TabComponent } from '@syncfusion/ej2-angular-navigations';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { EOCBasicModel } from '../eoc.model';
import { EocService } from '../eoc.service';

@Component({
  selector: 'app-eoc-container',
  templateUrl: './eoc-container.component.html'
})
export class EocContainerComponent implements OnInit {
  @ViewChild('tab') tab: TabComponent;
  routingId: any;
  eocOrder: EOCBasicModel;
  animation: TabAnimationSettingsModel = { previous: { effect: 'None' }, next: { effect: 'None' } };
  eocheaderName: string="Add Estimated Operations Costing";

  constructor(
    private route: ActivatedRoute,
    private toastr: ToasterDisplayService,
    private eocService: EocService
  ) { }

  ngOnInit(): void {
    this.routingId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.routingId) {
      this.eocheaderName="Edit Estimated Operations Costing";
      this.eocService.get(this.routingId).subscribe((res: any) => {
        res.productionUOM = parseInt(res.productionUOM);
        this.eocOrder = res;
      });
    }
    console.log("tab", this.tab);
  }

  selectTab(index) {
    console.log("tab selct", this.tab);
    this.tab.select(index);
  }

  public tabSelected(e: SelectEventArgs): void {
    console.log(e);
    if (e.isSwiped) {
      e.cancel = true;
    }
  }

}
