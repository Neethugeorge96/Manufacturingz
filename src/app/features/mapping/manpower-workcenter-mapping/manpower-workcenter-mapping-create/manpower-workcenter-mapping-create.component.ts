import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { EditSettingsModel, ToolbarItems, SaveEventArgs, GridComponent, CommandModel, CommandClickEventArgs } from '@syncfusion/ej2-angular-grids';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { ManPowerCategoryService } from '@settings/man-power-category/man-power-category.service';
import { ManPowertoWorkCenterService } from '../manpower-workcenter-mapping.service';
import { WorkCentersService } from '@settings/work-centers/work-centers.service';
import { OwnManPowerService } from '@settings/man-power/own-man-power.service';
import { HiredManPowerService } from '@settings/man-power/hired-man-power.service';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { enumSelector } from '@shared/utils/common.functions';
import { ManpowerType } from 'src/app/models/common/types/manpowertype';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { duplicateCodeValidator } from '@shared/utils/validators.functions';
import { FilteringEventArgs } from '@syncfusion/ej2-angular-dropdowns';
import { Query, Predicate } from '@syncfusion/ej2-data';

@Component({
    selector: 'app-manpower-workcenter-mapping-create',
    templateUrl: './manpower-workcenter-mapping-create.component.html',
})
export class ManpowerWorkcenterMappingCreateComponent implements OnInit {

    manpowerId: any;
    workCenter: any[];
    mappingForm: FormGroup;
    workCenterId: number;
    manPowerCategory: any[];
    manpowerToWorkCenter: any[];
    ownManPowerList: any[] = [];
    hiredManPowerList: any[] = [];
    hiredManPower: any[];
    public toolbarOptions: ToolbarItems[];
    manPowerTypeId: number;
    disableColumn: boolean;
    manpowerTypes = enumSelector(ManpowerType);
    closeResult: string;
    workCenterName: string;
    manpowerTypeName: string;
    ManpowerCategoryName: string;
    manpowerName: string;
    budgetedCostCurrencyCode: string;
    actualCostCurrencyCode: string;
    remarks: string;
    showErrorMsg = false;
    manPowerfiltername: any[];
    alreadyUsed: { codes: string[]; } = {
        codes: []
    };
    @ViewChild('content') modelPopup: any;
    public grid: GridComponent;
    public editSettings: EditSettingsModel = {
        showDeleteConfirmDialog: true,
        allowEditing: true,
        allowAdding: true,
        allowDeleting: true,
        mode: 'Dialog'
    };
    submitClicked: boolean;
    get manpowerType() { return this.mappingForm.get('manpowerType'); }
    get manpowerCategoryCode() { return this.mappingForm.get('manpowerCategoryCode'); }
    get manPowerName() { return this.mappingForm.get('manpowerCode'); }
    get budgetedCostPerHour() { return this.mappingForm.get('budgetedCostPerHour'); }
    get actualCostPerHour() { return this.mappingForm.get('actualCostPerHour'); }
    get remarksCtrl() { return this.mappingForm.get('remarks'); }
    dataForView: any;

    constructor(
        private toastr: ToasterDisplayService,
        private manPowerCategoryService: ManPowerCategoryService,
        private ownManPowerService: OwnManPowerService,
        private hiredManPowerService: HiredManPowerService,
        private workCentersService: WorkCentersService,
        private manPowertoWorkCenterService: ManPowertoWorkCenterService,
        private formBuilder: FormBuilder,
        private modalService: NgbModal
    ) { }

    public toolbar: ToolbarItems[] = ['Add', 'Search'];
    public commands: CommandModel[] = [
        { buttonOption: { content: 'View', cssClass: 'e-flat btn-view' } },
        { type: 'Edit', buttonOption: { cssClass: 'e-flat', iconCss: 'e-edit e-icons' } },
        { type: 'Delete', buttonOption: { cssClass: 'e-flat', iconCss: 'e-delete e-icons' } },
    ];

    // public query: Query = new Query().from('Customers').select(['manpowerName', 'manpowerCode']).take(7);

    ngOnInit(): void {
        forkJoin(
            [
                this.ownManPowerService.getAll(),
                this.hiredManPowerService.getAll(),
                this.manPowerCategoryService.getAll(),
                this.workCentersService.getAll()
            ])
            .subscribe(([resOwnManPower, resHiredManPower, resManPowerCategory, resWorkcenter]) => {
                this.workCenter = resWorkcenter;
                this.ownManPowerList = resOwnManPower;
                this.hiredManPowerList = resHiredManPower;
                this.manPowerCategory = resManPowerCategory;
            })
    }

    createFormGroup(data: any): FormGroup {
        return this.formBuilder.group({
            id: [data.id == null ? 0 : data.id],
            workCenterId: [data.workCenterId, [
            ]],
            manpowerType: [data.manpowerType, [
                Validators.required
            ]],
            manpowerCategoryCode: [data.manpowerCategoryCode, [
                Validators.required,
            ]],
            manpowerCategoryId: [data.manpowerCategoryId, [
                Validators.required,
            ]],
            manpowerCategoryName: [data.manpowerCategoryName, [
                Validators.required,
            ]],
            manpowerName: [data.manpowerName, [
                Validators.required,
            ]],
            manpowerCode: [data.manpowerCode, [
                Validators.required,
                duplicateCodeValidator(this.alreadyUsed.codes.filter(name => name !== (data.manpowerCode || '').toLowerCase()))
            ]],
            budgetedCostPerHour: [data.budgetedCostPerHour, [
                Validators.required,
                Validators.max(999999)


            ]],
            budgetedCostCurrencyCode: ['INR'],
            actualCostPerHour: [data.actualCostPerHour, [
                Validators.required,
                Validators.max(999999)

            ]],
            actualCostCurrencyCode: ['INR'],
            remarks: [data.remarks, [

                Validators.maxLength(128)

            ]],
            isValid: [true],
        });
    }
    onOptionsSelected(id) {
        this.showErrorMsg = false;
        this.workCenterId = id;
        this.getAllMappingByWorkCenterId();
    }
    open(content) {
        this.modalService.open(content,
            { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
                this.closeResult = `Closed with: ${result}`;
            }, (reason) => {
                this.closeResult =
                    `Dismissed ${this.getDismissReason(reason)}`;
            });
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }
    toolbarClick(args: ClickEventArgs): void {
        if (args.item.id === 'grid_398122113_0_pdfexport') {
            this.grid.pdfExport();
        } else if (args.item.id === 'grid_398122113_0_excelexport') {
            this.grid.excelExport();
        }
    }
    manPowerTypeOnChange(event) {
        this.manPowerTypeId = event.itemData.value;
        const id = this.mappingForm.controls.manpowerCategoryCode.value;
        const category = this.manPowerCategory.find(x => x.categoryCode === id);

        if (this.mappingForm.controls.manpowerCategoryCode.value) {

            if (this.manPowerTypeId === 1 && this.manPowerTypeId != undefined) {
                this.manPowerfiltername = this.ownManPowerList.filter((element) => element.manpowerCategoryId === category.id);
                this.mappingForm.controls.manpowerCode.setValue(null);
            } else if (this.manPowerTypeId === 2 && this.manPowerTypeId != undefined) {
                this.manPowerfiltername = this.hiredManPowerList.filter((element) => element.manpowerCategoryId === category.id);
                this.mappingForm.controls.manpowerCode.setValue(null);
            }
        }
    }

    manPowerCategoryOnChange(event) {
        this.mappingForm.patchValue({ manpowerCategoryName: event.itemData.categoryName });
        this.mappingForm.patchValue({ manpowerCategoryId: event.itemData.id });
        if (this.manPowerTypeId === 1 && this.manPowerTypeId != undefined) {
            this.manPowerfiltername = this.ownManPowerList.filter((element) => element.manpowerCategoryId === event.itemData.id);
        } else if (this.manPowerTypeId === 2 && this.manPowerTypeId != undefined) {
            this.manPowerfiltername = this.hiredManPowerList.filter((element) => element.manpowerCategoryId === event.itemData.id);
        }
    }

    manPowerNameOnChange(event) {
        if (event.itemData != null) {
            if (this.manpowerToWorkCenter) {
                if (this.manpowerToWorkCenter.find(x => x.manpowerCode === event.itemData.manpowerCode)) {
                    this.mappingForm.get('manpowerCode').setValue(null);
                    this.toastr.showErrorMessage('Duplicate manpower name selected');
                }
            }
            this.mappingForm.patchValue({ manpowerName: event.itemData.manpowerName });
            if (this.manPowerTypeId === 2) {
                this.hiredManPowerService.GetAllAssignHiredManPowerById(event.itemData.id).subscribe(result => {
                    if (result.length != 0) {
                        this.mappingForm.patchValue({ budgetedCostPerHour: result[0].costRatePerHour });
                    }
                },
                    error => {
                        console.error(error);
                        this.toastr.showErrorMessage('Unable to fetch the actual cost per hour');
                    });
            }
        }

    }
    getAllMappingByWorkCenterId() {
        this.manPowertoWorkCenterService.get(this.workCenterId).subscribe(result => {
            this.manpowerToWorkCenter = result;
            this.alreadyUsed = {
                codes: this.manpowerToWorkCenter.map(data => data.manpowerCode.toLowerCase())
            };
        },
            error => {
                console.error(error);
                this.toastr.showErrorMessage('Unable to fetch the man power to workcenter mapping details');
            });

    }
    commandClick(args: CommandClickEventArgs): void {
        if (args.commandColumn.buttonOption.content == 'View') {
            this.workCenterName = this.workCenter.find(x => x.id == args.rowData['workCenterId']).workCenterName;
            this.manpowerTypeName = this.manpowerTypes.find(x => x.value == args.rowData['manpowerType']).text;
            this.ManpowerCategoryName = args.rowData['manpowerCategoryName'];
            this.manpowerName = args.rowData['manpowerName'];
            this.budgetedCostCurrencyCode = args.rowData['budgetedCostCurrencyCode'];
            this.actualCostCurrencyCode = args.rowData['actualCostCurrencyCode'];
            this.remarks = args.rowData['remarks'];
            this.dataForView = args.rowData;
            this.open(this.modelPopup);
        }
    }
    public getManTypePowerName = (field: string, data: Object, column: Object) => {
        const manpowertype = ManpowerType;
        return manpowertype[data[field]];
    }

    actionComplete(args) {
        if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
            const dialog = args.dialog;
            dialog.header = args.requestType === 'beginEdit' ? 'Edit Manpower To Workcenter' : 'Add Manpower To Workcenter';
        }
    }
    actionBegin(args: SaveEventArgs): void {

        this.disableColumn = false;
        if (args.requestType === 'beginEdit' || args.requestType === 'add') {
            this.submitClicked = false;
            if (args.rowData['manpowerType'] == 1) {
                this.manPowerfiltername = this.ownManPowerList.filter((element) => element.manpowerCategoryId === args.rowData['manpowerCategoryId']);
            } else {
                this.manPowerfiltername = this.hiredManPowerList.filter((element) => element.manpowerCategoryId === args.rowData['manpowerCategoryId']);
            }
            this.mappingForm = this.createFormGroup(args.rowData);
            if (args.requestType === 'beginEdit') {
                this.submitClicked = false;
                this.mappingForm.patchValue({ manpowerType: this.manpowerTypes.find(x => x.value == this.mappingForm.value.manpowerType).text });
                this.disableColumn = true;
            }
            if (args.requestType === 'add') {
                this.submitClicked = false;
                if (!this.workCenterId) {
                    this.showErrorMsg = true;
                }
            }
        } else if (args.requestType === 'save') {
            this.submitClicked = true;
            if (this.mappingForm.valid) {
                let _insertdata = this.mappingForm.value;
                const manPowerType = this.manpowerTypes.find(x => x.text === _insertdata.manpowerType).value;
                if (manPowerType === 1) {
                    this.manpowerId = this.ownManPowerList.find((element) => element.manpowerCode === _insertdata.manpowerCode).id;
                }
                if (manPowerType === 2) {
                    this.manpowerId = this.hiredManPowerList.find((element) => element.manpowerCode === _insertdata.manpowerCode).id;
                }
                _insertdata.manpowerId = this.manpowerId;
                _insertdata = {
                    ..._insertdata,
                    workCenterId: this.workCenterId != undefined ? this.workCenterId : null
                };

                if (!(_insertdata['id'])) {
                    this.manPowertoWorkCenterService.add(_insertdata)
                        .subscribe(res => {
                            if (res) {
                                this.toastr.showSuccessMessage('Manpower to Workcenter mapping added successfully!');
                                this.getAllMappingByWorkCenterId();

                                const workCenter = this.workCenter.find(x => x.id === _insertdata.workCenterId);
                                workCenter.isAssigned = true;
                                this.workCentersService.update(workCenter).subscribe(res => {

                                });
                            }
                        },
                            error => {
                                console.error('err', error);
                                this.toastr.showErrorMessage('Unable to add the Manpower to Workcenter mapping Details');
                            }
                        );
                } else {
                    this.manPowertoWorkCenterService.update(_insertdata)
                        .subscribe(res => {
                            if (res) {
                                this.toastr.showSuccessMessage('Man power to Workcenter mapping updated successfully!');
                                this.getAllMappingByWorkCenterId();

                                const workCenter = this.workCenter.find(x => x.id === _insertdata.workCenterId);
                                workCenter.isAssigned = true;
                                this.workCentersService.update(workCenter).subscribe(res => {

                                });
                            }
                        },
                            error => {
                                console.error('err', error);
                                this.toastr.showErrorMessage('Unable to add the Manpower to Workcenter mapping Details');
                            }
                        );
                }
            } else {
                args.cancel = true;
            }
        } else if (args.requestType === 'delete') {
            const row: any = args;
            const id = row.data[0] ? row.data[0].id : 0;
            if (id) {
                this.manPowertoWorkCenterService.delete(id).subscribe(res => {
                    if (res) {
                        this.toastr.showSuccessMessage('Man power deleted from Workcenter successfully!');
                    }
                },
                    error => {
                        console.error('err', error);
                        this.toastr.showErrorMessage('Unable to delete the Manpower to Workcenter mapping Details');
                    }
                );
            }
        }
    }

    public onFilteringWC = (e: FilteringEventArgs) => {
        let query = new Query();
        const predicateQuery = query.where(new Predicate('workCenterName', 'contains', e.text, true).or('workCenterCode', 'contains', e.text, true));
        query = (e.text !== '') ? predicateQuery : query;
        e.updateData(this.workCenter, query);
    }

    public onFilteringRes = (e: FilteringEventArgs) => {
        let query = new Query();
        const predicateQuery = query.where(new Predicate('categoryName', 'contains', e.text, true).or('categoryCode', 'contains', e.text, true));
        query = (e.text !== '') ? predicateQuery : query;
        e.updateData(this.manPowerCategory, query);
    }
}

