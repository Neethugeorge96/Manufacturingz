import { Model } from '@shared/models/model';

export interface OperationTimeTrackerModel extends Model {
    id: number;
    productionOrderId: number;
    batchTimeTrackerId: number;
    batchNumber: number;
    startTime: string;
    endTime: string;
    routingId: number;
    routingName: string;
    operationId: number;
    operationName: string;
    operationOutput: number;
    uom: string;
    damageQuantity: number;
    damageReason: string;
    remarks: string;
}

