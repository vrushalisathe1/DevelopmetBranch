export class rolodexutilityResponse {
    EmployeesList: Array<rolodexutilitylist>;
    totalCount: number;
}
export class rolodexutilitylist {   
    EmployeeNumber:number;
    FirstName:string;
    LastName: string;
    MiddleName: string;
    HomePhone:number;
    EmergPhone:number;
    DepartmentName:string;    
}