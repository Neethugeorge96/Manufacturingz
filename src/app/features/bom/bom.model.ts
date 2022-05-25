import { Model } from '@shared/models/model';
import { ProductionUnit } from 'src/app/models/common/types/productionunit';

export interface BOMItem extends Model {
    itemCode: string;
    itemName: string;
    uOMCode: string;
    uOMName: string;
    cPCCode: string;
    cPCName: string;
    quantity: number;
    movingWeightedAverageCostPerUnit: number;
    latestPurchaseCostPerUnit: number;
    standardCostPerUnitForCostEstimation: number;
    priceVarianceProvision: number;
    costPriceComponentId: number;
    isMaterialIssueLinkToWorkcenter: boolean;
    workcenterId?: number;
    workcenterCode: string;
    workcenterName: string;
    isLotTrackingRequired: boolean;
    isMaterialIssueByBackflushing: boolean;
    manufacturedProductCode: string;
}
export class MaintainProduction extends Model {
    id: number;
    manufacturedProductCode: string;
    manufacturedProduct: string;
    productUOMCode: string;
    ProductUOMName: string;
    bOMQuantity: number;
    bOMItems: any[];
    bOMItemDeletedList: number[];
}
