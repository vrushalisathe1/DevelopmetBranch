export class UserResponse {
    userlist: Array<UserList>;
    totalCount: number;
}

export class UserList {
    UserNum: number;
    FirstName: string;
    LastName: string;
    Email: string;
    EmailNotification: number;
    Phone: string;
    Password: string;
    UserName: string;
    RoleID: number;
    RoleName: string;
}
