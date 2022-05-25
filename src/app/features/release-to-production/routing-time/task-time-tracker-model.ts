import { Model } from '@shared/models/model';

export interface TaskTimeTrackerModel extends Model {
    productionOrderId: number;
    operationTimeTrackerId: number;
    batchNumber: number;
    startTime: string;
    endTime: string;
    taskId: number;
    taskName: string;
    operationId: number;
    operationName: string;
    uom: string;
    remarks: string;
}
