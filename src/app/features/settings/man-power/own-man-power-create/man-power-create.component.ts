import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { duplicateNameValidator } from '@shared/utils/validators.functions';
import { Subscription } from 'rxjs';
import { ManpowerType } from 'src/app/models/common/types/manpowertype';
import { OwnManPowerService } from '../own-man-power.service';

@Component({
  selector: 'app-man-power-create',
  templateUrl: './man-power-create.component.html',
  styles: [
  ]
})
export class OwnManPowerCreateComponent implements OnInit, OnDestroy {
  addForm: FormGroup;
  @Input() manPowerCategories;
  @Input() alreadyUsed;
  @Input() employees;
  isAddingEmployees = false;
  manpowerType = ManpowerType;
  manpowerTypeKeys: number[];
  fields: object = { text: 'name', value: 'id' };
  subscribers: Subscription[] = [];
  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private manPowerService: OwnManPowerService
  ) { }
  ngOnDestroy(): void {
    this.subscribers.forEach(subscriber => {
      subscriber.unsubscribe();
    });
  }

  ngOnInit(): void {
    this.addForm = this.createFormGroup();
    this.subscribers.push(this.addForm.valueChanges.subscribe(res => {
      const employee = this.employees.find(emp => emp.text === res.manpowerId);
      if (!employee) {
        this.addForm.controls.manpowerId.setErrors(({ required: true }));
      } else {
        this.addForm.controls.manpowerId.setErrors((null));
      }
      this.addForm.patchValue({
        email: employee ? employee.email : '',
        phone: employee ? employee.phone : '',
        manpowerName: employee ? employee.name : '',
        manpowerCode: employee ? employee.employeeCode : ''
      }, { emitEvent: false });
    }));
    this.manpowerTypeKeys = Object.keys(this.manpowerType).filter(Number).map(Number);
  }
  createFormGroup(): FormGroup {
    return this.formBuilder.group({
      // id: [null, [
      //   // Validators.required
      // ]],
      manpowerId: ['', [
        Validators.required,
      ]],
      manpowerCategoryId: [null, [
        Validators.required,
      ]],
      manpowerType: [1, [
        Validators.required,
      ]],
      manpowerName: [{ value: '', disabled: true }, [
        Validators.required,
        Validators.maxLength(32),
        // duplicateNameValidator(this.alreadyUsed.names)

      ]],
      manpowerCode: ["123"],
      ManpowerCategory: ['DJAISON'],
      email: [{ value: '', disabled: true }, [
        // Validators.required,
        Validators.email
      ]],
      phone: [{ value: '', disabled: true }, [
        Validators.maxLength(256),
        Validators.required
      ]],
     
      remarks: ['', [
        Validators.maxLength(125)
       
      ]],
      // createdBy: [this.currentUserId],
      // modifiedBy: [this.currentUserId]
    });
  }
  randomString(length, chars) {
    let result = '';
    for (let i = length; i > 0; --i) { result += chars[Math.floor(Math.random() * chars.length)]; }
    return result;
  }
  goToAddHired() {
    this.isAddingEmployees = true;
  }
  onAddHired() {
    this.isAddingEmployees = false;
  }
  onSubmit() {
    console.log(this.addForm.getRawValue());
    const addForm = {
      ...this.addForm.getRawValue(),
      manpowerId: this.employees.find(emp => emp.text === this.addForm.getRawValue().manpowerId).id
    };
    this.manPowerService.add(
      {
        ...this.addForm.getRawValue(),
        manpowerId: this.employees.find(emp => emp.text === this.addForm.getRawValue().manpowerId).id
      }
    )
      .subscribe(res => {
        if (res) {
          this.activeModal.close('submit');
        }
      });
  }
}
