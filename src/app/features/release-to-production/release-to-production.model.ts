import { Model } from '@shared/models/model';
import { ProductionOrderStatus } from 'src/app/models/common/types/productionorderstatus';

export class PlannedProductionOrder extends Model {
    productionOrderNumber: string;
    productionOrderDate: string;
    ProductionCode: string;
    productionItem: string;
    productionQuantity: number;
    uOM: string;
    batchSize: number;
    productionLineCode: string;
    productionLineName: string;
    status: ProductionOrderStatus;
}
