import { Model } from '@shared/models/model';
import { RoutingType } from 'src/app/models/common/types/routingtype';

export interface BasicRouting extends Model {
    routingCode: string;
    routingName: string;
    routingType: RoutingType;
    mainRoutingCode: string;
    productionLineCode: string;
    productionLineName: string;
    productionLineId: number;
    isCompleted: boolean;
}
