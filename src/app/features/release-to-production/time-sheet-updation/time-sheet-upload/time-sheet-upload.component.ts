import { Component, ViewChild, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { EmitType, detach } from '@syncfusion/ej2-base';
import { UploaderComponent, RemovingEventArgs } from '@syncfusion/ej2-angular-inputs';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { CheckBoxComponent } from '@syncfusion/ej2-angular-buttons';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import * as XLSX from 'xlsx';
import { Dialog } from '@syncfusion/ej2-popups';
import { Uploader } from '@syncfusion/ej2-inputs';

@Component({
  selector: 'app-time-sheet-upload',
  templateUrl: './time-sheet-upload.component.html'
})
export class TimeSheetUploadComponent implements OnInit {

  // @ViewChild('defaultupload')
  // public uploadObj: UploaderComponent;
  @ViewChild('grid')
    public gridObj: GridComponent;

  
  constructor(
    private dialog: Dialog,
    private uploadObj: Uploader
  ) { }

  public dropElement: HTMLElement = document.getElementsByClassName('control-fluid')[0] as HTMLElement;

  public onFileRemove(args): void {
    args.cancel = true;
  }

  ngOnInit(): void {
    
    this.dialog = new Dialog({
      // Enables the header
      header: 'Dialog',
      // Enables the close icon button in header
      showCloseIcon: true,
      visible: false,
      // Dialog content
      content: this.uploadObj.element,
      // The Dialog shows within the target element
      target: document.getElementById("container"),
      // Dialog width
      width: '250px'
    });
    this.dialog.appendTo('#dialog');
  }

  parseExcel(file) {
    debugger
    var reader = new FileReader();
    reader.onload = (e) => {
      var data = (<any>e.target).result;
      var workbook = XLSX.read(data, {
        type: 'binary'
      });
      workbook.SheetNames.forEach((function (sheetName) {
        // Here is your object
        var XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        var json_object = JSON.stringify(XL_row_object);
        console.log(json_object)
        this.gridObj.dataSource = JSON.parse(json_object);
        this.uploadObj.clearAll();
        this.dialog.hide();

      }).bind(this), this);
    };

    reader.onerror = function (ex) {
      console.log(ex);
    };
    reader.readAsBinaryString(file);
  };

  public onSuccess(args: any): void {
    debugger
    var files = args.target.files; // FileList object
    this.parseExcel(files[0]);
  }

  importFile(e) {
    this.dialog.show();
  }

}
