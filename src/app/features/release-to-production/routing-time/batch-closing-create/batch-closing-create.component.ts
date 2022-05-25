import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TimePickerComponent } from '@syncfusion/ej2-angular-calendars';
import { BatchTimeTrackerModel } from '../batch-time-tracker-model';
import { BatchTrackerService } from '../batch-tracker.service';

@Component({
  selector: 'app-batch-closing-create',
  templateUrl: './batch-closing-create.component.html',
  styles: [
  ]
})
export class BatchClosingCreateComponent implements OnInit {

  @Input() routeData: BatchTimeTrackerModel;

  startForm: FormGroup;

  submitClicked = false;
  get endTime() { return this.startForm.get('endTime'); }
  get remarks() { return this.startForm.get('remarks'); }
  get batchOutput() { return this.startForm.get('batchOutput'); }
  get damageQuantity() { return this.startForm.get('damageQuantity'); }
  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private batchTrackerService: BatchTrackerService

  ) { }

  ngOnInit(): void {
    this.startForm = this.createFormGroup();
    this.startForm.valueChanges.subscribe(res => {
      if (!this.startForm.get('endTime').errors) {
        if (new Date(this.startForm.getRawValue().startTime).getTime() > new Date(res.endTime).getTime()) {
          this.startForm.get('endTime').setErrors({ earlier: true });
        } else {
          this.startForm.get('endTime').setErrors(null);
        }
      }
    });
  }

  createFormGroup(): FormGroup {
    return this.formBuilder.group({
      id: [this.routeData.id],
      productionOrderId: [this.routeData.productionOrderId],
      batchNumber: [this.routeData.batchNumber],
      startTime: [{ value: new Date(this.routeData.startTime + 'Z'), disabled: true }],
      endTime: [new Date(), [Validators.required]],
      batchCode: [this.routeData.batchCode],
      batchOutput: [this.routeData.batchOutput, [Validators.required]],
      uom: [this.routeData.uom],
      damageQuantity: [this.routeData.damageQuantity, [Validators.required]],
      damageReason: [this.routeData.damageReason],
      remarks: [this.routeData.remarks],
    });
  }

  submit() {
    this.submitClicked = true;
    if (this.startForm.valid) {
      this.batchTrackerService
        .update(this.startForm.getRawValue()).subscribe(res => {
          if (res) {
            this.activeModal.close('submit');
            this.submitClicked = false;
          }
        });
    }
  }

}
