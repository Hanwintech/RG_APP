

export class ReportStatisticalCulturalRelicByLevelInfos {
    public reportStatisticalCulturalRelicByLevelInfoList: UVCulturalRelicStatisticalLevelQuery[];
    public sum: number;
    public actualSum: number;
}
export class UVCulturalRelicStatisticalLevelQuery {
    /**
      * 主键
      */
    public	keyID: string;
    /**
     * 单位名称
     */
    public	collectionUnitName: string;

    /**
     * 件1
     */
    public	culturalSum1: number;

    /**
     * 实际数量1
     */
    public	culturalActualSum1: number;

    /**
     * 件2
     */
    public	culturalSum2: number;

    /**
     * 实际数量2
     */
    public	culturalActualSum2: number;

    /**
     * 件3
     */
    public	culturalSum3: number;

    /**
     * 实际数量3
     */
    public	culturalActualSum3: number;

    /**
     * 件4
     */
    public	culturalSum4: number;

    /**
     * 实际数量4
     */
    public	culturalActualSum4: number;

    /**
     * 件5
     */
    public	culturalSum5: number;

    /**
     * 实际数量5
     */
    public	culturalActualSum5: number;
}