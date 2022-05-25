import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { duplicateNameValidator } from '@shared/utils/validators.functions';
import { ManpowerType } from 'src/app/models/common/types/manpowertype';
import { OwnManPowerService } from '../own-man-power.service';

@Component({
  selector: 'app-man-power-edit',
  templateUrl: './man-power-edit.component.html',
  styles: [
  ]
})
export class OwnManPowerEditComponent implements OnInit {

  editForm: FormGroup;
  @Input() manPower;
  @Input() manPowerCategories;
  @Input() alreadyUsed;
  manpowerType = ManpowerType;
  manpowerTypeKeys: number[];
  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private manPowerService: OwnManPowerService
  ) {
    this.manpowerTypeKeys = Object.keys(this.manpowerType).filter(Number).map(Number);
   }

  ngOnInit(): void {
    this.editForm = this.createFormGroup();
    this.editForm.patchValue(this.manPower);
  }
  createFormGroup(): FormGroup {
    return this.formBuilder.group({
      id: [null, [
        // Validators.required
      ]],
      manpowerId: [''],
      manpowerCategoryId: [null, [
        Validators.required,
      ]],
      manpowerType: [1, [
        Validators.required,
      ]],
      manpowerName: [null, [
        Validators.required,
        Validators.maxLength(32),
        duplicateNameValidator(this.alreadyUsed.names.filter(name => name !== this.manPower.manpowerName))
      ]],
      email: ['', [
        // Validators.required,
        Validators.email
      ]],
      phone: ['', [
        Validators.maxLength(256),
        Validators.required
      ]],
      remarks: ['', [
      ]],
      // employeeId: [this.currentUserId],
      // requestStatus: [1],
      // createdBy: [this.currentUserId],
      // modifiedBy: [this.currentUserId]
    });
  }
  onSubmit() {
    this.manPowerService.update(this.editForm.value).subscribe(res => {
      if (res) {
        this.activeModal.close('submit');
      }
    });
  }

}
