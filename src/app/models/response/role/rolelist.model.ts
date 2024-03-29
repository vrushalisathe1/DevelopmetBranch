export class rolelistResponse {
    RoleList: Array<rolelist>;
    totalCount: number;
}
export class rolelist {   
    roleid: number;
    name: string;      
    isActive:Boolean;
}