import { Model } from '@shared/models/model';

export interface ManPowerCategory extends Model {
    categoryCode: string;
    categoryName: string;
    description: string;
    costRatePerHour: number;
    currencyId: number;
    currencyCode: string;
    costComponentId: number;
    costPriceComponent: string;
    isAssigned: boolean;
}