import { Model } from '@shared/models/model';

export interface ProductionRouting extends Model {
    productionLineId: number;
    productionLineName: string;
    productionLineCode: string;
    manufacturedProductCode: string;
    manufacturedProduct: string;
    routingId: number;
    routingCode: string;
    routingName: string;
}
