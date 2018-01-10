import { BaseApiSearch } from "./../base-api-search.model";
export class ReportStatisticalCulturalRelicSearch extends BaseApiSearch {
    public userId: string;
    public manageUnitId: string;
    public userType: number;

    constructor() {
        super();
        this.clearNumbers();
    }
    public clearNumbers() { }
}






