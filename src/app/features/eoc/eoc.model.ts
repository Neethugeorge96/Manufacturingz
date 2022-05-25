import { Model } from '@shared/models/model';
import { RoutingCostingBasis } from 'src/app/models/common/types/routingcostingbasis';
import { EOCOperation } from './operation.model';

export interface EOCBasicModel extends Model {
    manufacturedProductCode:string;
    manufacturedProduct:string;
    routingId: number;
    routingCode:string;
    routingName:string;
    routingCostingBasis:RoutingCostingBasis;
    productionUOM:string;
    productionQuantity:number;
    productionLineId:number;
    productionLineName: string;
    productionLineCode:string;
    eocOperationCollection:EOCOperation;
}