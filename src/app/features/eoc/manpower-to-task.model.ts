import { Model } from '@shared/models/model';

export interface EOCManpower extends Model {
    taskId: number;
    taskCode: string;
    taskName: string;
    manpowerCategoryCode: string;
    manpowerCategory: string;
    noOfResources: number;
    operationHour: number;
    manpowerCostPerHour: number;
    manpowerCostPerCategory: number;
    idleHours: number;
    idleHourCost: number;
    currencyCode: string;
}
