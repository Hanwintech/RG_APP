import { BaseApiSearch } from "./../base-api-search.model";

export class ReportQueryPatrolSearch extends BaseApiSearch {
    public userId: string;
    public manageUnitId: string;
    public userType: number;
    public startDateTime: string;
    public endDateTime: string;
    public patrolStatus: number;
    public startYear: number;
    public endYear: number;
    public startMonth: number;
    public endMonth: number;
    public startQuarter: number;
    public endQuarter: number;
    public startHalfYear: number;
    public endHalfYear: number;
}


 

 