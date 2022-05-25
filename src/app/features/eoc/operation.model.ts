import { Model } from '@shared/models/model';
import { EOCTask } from './task.model';

export interface EOCOperation extends Model {
    routingId: number;
    routingCode: string;
    routingName: string;
    workCenterId: number;
    workCenterName: string;
    operationNumber: number;
    operationName: string;
    yieldPercentage: number;
    isByproductGenerated: boolean;
    byProductPercentage: number;
    manufacturedProductCode: string;
    manufacturedProduct: string;    
    eocTaskCollection: EOCTask;
}
