import { Model } from '@shared/models/model';

export interface ReleaseTimesheet extends Model {
    productionOrderId: number;
    manpowerCategoryId: number;
    manpowerCategory: string;
    employeeId: number;
    employeeName: string;
    shiftId: number;
    shiftName: string;
    batchNumber: string;
    operationId:number;
    operationName: string;
    taskId: number;
    taskName: string;
    inTime: string;
    outTime:string;
}