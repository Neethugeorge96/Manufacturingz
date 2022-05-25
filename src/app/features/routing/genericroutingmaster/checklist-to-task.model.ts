import { Model } from '@shared/models/model';

export interface ChecklistToTask extends Model {
    taskId: number;
    taskCode: string;
    checkListItem: string;
    description: string;
}
