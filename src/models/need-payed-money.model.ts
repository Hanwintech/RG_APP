export interface INeedPayedMoney {
    name: string;
    certNo: string;
    contractID: string;
    contractNo: string;
    address: string;
    needPayedDate: string;
    feeType: number;
    terms: string;
    money: number;
    realMoney: number;
    payedPerson: string;
    payedType: number;
    payedDate: string;
    remark: string;
}