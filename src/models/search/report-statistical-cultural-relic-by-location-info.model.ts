

export class ReportStatisticalCulturalRelicByLocationInfos {
    public reportStatisticalCulturalRelicByLocationInfoList: UVCulturalRelicStatisticalQuery[];
    public sum: number;
    public actualSum: number;
}
export class UVCulturalRelicStatisticalQuery {
    /**
     * 主键ID
     */
    public	keyID: string;

    /**
     * 库名
     */
    public	collectionUnitName: string;

    /**
     * 藏品数量
     */
    public	culturalSum: number;

    /**
     * 藏品实际数量
     */
    public	culturalActualSum: number;

    /**
     * 展区数量
     */
    public	exhibitionSum: number;

    /**
     * 展区实际数量
     */
    public	exhibitionActualSum: number;

    /**
     * 仓库数量
     */
    public	storeSum: number;

    /**
     * 仓库实际数量
     */
    public	storeActualSum: number;

    /**
     * 外借数量
     */
    public	borrowSum: number;

    /**
     * 外借实际数量
     */
    public	borrowActualSum: number;

}