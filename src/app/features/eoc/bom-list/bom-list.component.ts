import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';

import { enumSelector } from '@shared/utils/common.functions';
import { ActivatedRoute } from '@angular/router';
import { EocService } from '../eoc.service';

@Component({
  selector: 'app-bom-list',
  templateUrl: './bom-list.component.html'
})
export class BomListComponent implements OnInit {

  disableColumn: boolean;
  bomList: any;
  routingId: number;

  public toolbar: ToolbarItems[] = ['Search'];
  @Output() completed: EventEmitter<any> = new EventEmitter();

  constructor(
    private toastr: ToasterDisplayService,
    private route: ActivatedRoute,
    public modalService: NgbModal,
    private eocService: EocService
  ) { }

  ngOnInit(): void {
    this.routingId = Number(this.route.snapshot.paramMap.get('id'));
    this.getBomList();
  }

  getBomList() {
    this.eocService.getEOCBOMDetails(this.routingId).subscribe(result => {
      this.bomList = result;
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the BOM List Details');
      });
  }

  previous(){
    this.completed.emit(2);
  }

}
