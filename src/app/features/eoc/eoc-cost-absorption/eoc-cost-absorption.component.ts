import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { CostPriceComponet } from '@settings/cost-price/cost-price.model';
import { CostAbsorpationType } from 'src/app/models/common/types/costabsorpationtype';
import { enumSelector } from '@shared/utils/common.functions';
import { CostAbsorptionToWorkCenter } from '@features/mapping/work-center-cost-overhead-mapping/work-center-cost-overhead-mapping.model';
import { EocCostAbsorptionService } from '../eoc-cost-absorption.service';
import { ActivatedRoute } from '@angular/router';
import { WorkCentersService } from '@settings/work-centers/work-centers.service';
import { WorkCenter } from '@settings/work-centers/work-centers.model';


@Component({
  selector: 'app-eoc-cost-absorption',
  templateUrl: './eoc-cost-absorption.component.html'
})
export class EocCostAbsorptionComponent implements OnInit {

  CPCEstimatedList: any[] = [];
  workCenter: WorkCenter[] = [];
  disableColumn: boolean;
  costAbsorptionToWorkCenter: CostAbsorptionToWorkCenter[] = [];
  costAbsorpationTypes = enumSelector(CostAbsorpationType);
  routingId: number;

  public toolbar: ToolbarItems[] = ['Search'];
  @Output() completed: EventEmitter<any> = new EventEmitter();

  constructor(
    private toastr: ToasterDisplayService,
    private eocCostAbsorptionService: EocCostAbsorptionService,
    private route: ActivatedRoute,
    public modalService: NgbModal,
    private workCentersService: WorkCentersService,
  ) { }

  public getCostAbsorptionTypeName = (field: string, data: Object, column: Object) => {
    let costAbsorpationType = CostAbsorpationType;
    return costAbsorpationType[data[field]];
  }

  ngOnInit(): void {
    this.routingId = Number(this.route.snapshot.paramMap.get('id'));
    this.getAllWorkCenters();
    this.getCPCEstimatedOperationsCostDetails();
    this.costAbsorpationTypes = enumSelector(CostAbsorpationType);
  }

  getAllWorkCenters() {
    this.workCentersService.getAll().subscribe(result => {
      this.workCenter = result;
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the work centers Details');
      });
  }

  getCPCEstimatedOperationsCostDetails() {
    this.eocCostAbsorptionService.getCPCEstimatedOperationsCost(this.routingId).subscribe(result => {
      this.costAbsorptionToWorkCenter = result;
      this.CPCEstimatedList = this.costAbsorptionToWorkCenter.map(res => {
        return {
          ...res,
          workCenterId: this.workCenter.find(x => x.id === res.workCenterId).workCenterName,
        }
      });
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the CPC estimated operations cost details');
      });
  }

  previous(){
    this.completed.emit(1);
  }

  next() {
    this.completed.emit(3);
  }

}
