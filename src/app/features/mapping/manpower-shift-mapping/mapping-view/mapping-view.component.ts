import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { ManpowerToShift } from '../manpower-shift-mapping.model';
import { ManpowerShiftMappingService } from '../manpower-shift-mapping.service';

@Component({
  selector: 'app-mapping-view',
  templateUrl: './mapping-view.component.html',
})
export class MappingViewComponent implements OnInit {
  @Input() manPowerCategories;
  @Input() manPower; 
  @Input() shiftDetails;
  @Input() productionShifts;
  @Input() manpowerToShiftDataS;
  manpowerToShift: ManpowerToShift[] = [];
  shiftName : string;
  @ViewChild('grid')
  public grid: GridComponent;

  constructor( 
    public activeModal: NgbActiveModal,
    private manpowerShiftMappingService: ManpowerShiftMappingService,
    ) { }

  ngOnInit(): void {
    if(this.shiftDetails){
      this.shiftName = this.shiftDetails.shiftName;
      this.manpowerShiftMappingService.GetAllByShiftCode(this.shiftDetails.shiftCode).subscribe(
        (response : any) => {
          if(response){
            this.manpowerToShift = response  
          }
        }
      )
    } 
  }

} 
