import { Model } from '@shared/models/model';

export interface CostAbsorptionToWorkCenter extends Model {
    workCenterId: number;
    cpcCode: string;
    cpcName: string;
    costAbsorpationBasis: number;
    // costAbsorpationBasisName: string;
    costAbsorptionRatePerHour: number;
    currencyCode: string;
    description: string;
    isValid: boolean;
}