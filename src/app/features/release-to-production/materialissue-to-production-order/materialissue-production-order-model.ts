import { Model } from '@shared/models/model';
export class MaterialIssueToProductionOrder extends Model {
    productionOrderId:number;
    itemCode: string;
    itemName: string;
    issueMaterialFromCode: string;
    issueMaterialFromName: string;
    uOMCode: string;
    quantity: number;
    actualUOMCode: string;
    actualQuantity: number;
    batchNumber: number;
}
export class PlannedPOBillOfMaterial {
    productionOrderId: number;
    maintainProductionId: number;
    plannedPOBillOfMaterialItem: PlannedPOBillOfMaterialItem[];
}
export class PlannedPOBillOfMaterialItem {
    plannedPOBillOfMaterialId: number;
    batchNumber: number;
    itemCode: string;
    itemName: string;
    uOMCode: string;
    uOMName: string;
    quantity: number;
    movingWeightedAverageCostPerUnit: number;
    latestPurchaseCostPerUnit: number;
    standardCostPerUnitForCostEstimation: number;
    priceVarianceProvision: number;
    cPCCode: string;
    cPCName: string;
    isMaterialIssueLinkToWorkcenter: boolean;
    workcenterId: number;
    isLotTrackingRequired: boolean;
    isMaterialIssueByBackflushing: boolean;
    manufacturedProductCode: string;
}