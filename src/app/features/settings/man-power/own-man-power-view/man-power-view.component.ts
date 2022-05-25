import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-man-power-view',
  templateUrl: './man-power-view.component.html',
  styles: [
  ]
})
export class OwnManPowerViewComponent implements OnInit {
  @Input() manPower;
  @Input() manPowerCategories;
  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

}
