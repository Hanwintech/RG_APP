//import { BaseApiSearch } from "./../base-api-search.model";

export class ReportQueryPatrolByDistrictInfo {
    public reportQueryPatrolByDistrict: UPReportQueryPatrolByDistrict;

}
export class UPReportQueryPatrolByDistrict {
    public district: number;
    public districtName: string;
    public patrolCount: number;
}



