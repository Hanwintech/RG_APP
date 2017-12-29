export class UserInfo {
    public user: UserEntity;
    public newPassword: string;
    public userTypeName: string;
    public manageUnitName: string;
    public token: string;
    public code: number;
    public message: string;
    public tag: string;
    public appRole: number[];
}

export class UserEntity {
    public id: string;
    public password: string;
    public userType: number;
    public manageUnit: string;
    public mobilePhone: string;
    public email: string;
    public xOrder: number;
    public isDeleted: boolean;
    public officePhone: string;

    constructor(public account: String, public name: String) { }
}

export class CommonUserInfo  {
    public userId: string;
    public userName: string;
    public manageUnitID: string;
    public manageUnitName: string;
    public mobilePhone: string;
    public officePhone: string;
}