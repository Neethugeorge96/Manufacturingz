import { Model } from '@shared/models/model';

export interface ManpowerToTask extends Model {
    taskId: number;
    taskCode: string;
    manpowerCategoryCode: string;
    manpowerCategory: string;
    manpowerName: string;
    noOfResources: number;
    costPerHour: number;
    currencyCode: string;
}
