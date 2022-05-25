import { Model } from '@shared/models/model';
import { MaterialIssueStatus } from 'src/app/models/common/types/materialissuestatus';

export class MaterialIssue extends Model {
    id: number;
    materialRequestNumber: string;
    workCenterCode: string;
    workCenterName: string
    requestMaterialToCode: string;
    requestMaterialToName: string;
    requestedDate: string;
    requestMaterialFromCode: string;
    requestMaterialFromName: string;
    requestedBy: string;
    requestedByCode: string;
    status: MaterialIssueStatus
    remarks: string;
    detailMaterialIssueItems: any[];
    detailMaterialIssueDeleteList: number[];
    numberOfRequestedItems: number;
}

export interface DetailMaterialIssue extends Model {
    itemCode: string;
    itemName: string;
    requestedQuantity: number;
    requestedQuantityUOMCode: string;
    requestedQuantityUOMName: string;
    stockQuantityUOMCode: string;
    stockQuantityUOMName: string;
    storeQuantityUOMCode: string;
    storeQuantityUOMName: string;
    storeQuantity: number;
    stockQuantity: number;
    suggestedQuantity: number;
    suggestedQuantityUOMCode: string;
    suggestedQuantityUOMName: string;
    issueQuantity: number;
    issueQuantityUOMCode: string;
    issueQuantityUOMName: string;
    remarks: string;
}


