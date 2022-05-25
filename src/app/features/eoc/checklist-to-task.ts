import { Model } from '@shared/models/model';

export interface ChecklistToTask extends Model  {
    taskId: string;
    checkListItem: string;
    description: string;
}
