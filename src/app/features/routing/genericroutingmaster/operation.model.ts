import { Model } from '@shared/models/model';

export interface Operation extends Model {
    routingId:number;
    routingCode: string;
    operationNumber: number;
    operationName: string;
    isSubcontracted: boolean;
    isOutputRequired:boolean;
    batchControl:boolean;
    backflushMaterial:boolean;
    qualityControlRequired:boolean;
    workCenterId: number;
}
