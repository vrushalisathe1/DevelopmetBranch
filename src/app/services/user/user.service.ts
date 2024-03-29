import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cookie } from '../cookie.service';
import { AppInsightsService } from '../app-insights.service';
import { Observable, of } from 'rxjs';
import { CoreDataService } from '../core-data.service';
import { userlistrequest } from '../../models/request/employee/user/userlistrequest.model';
import { Action } from '../../views/shared/action';
import { UserModel } from '../../models/response/user/user.model';
import { environment } from '../../../environments/environment';
import { Controllers } from '../../views/shared/controller';
import { UserList } from '../../models/response/user/userResponse.model';
import { BaseResponse } from '../../models/core/baseResponse.model';
import { userAddUpdateRequest } from '../../models/request/employee/user/useraddupdate.model';

@Injectable({
    providedIn: 'root'
})
export class UserService extends CoreDataService {
    constructor(httpClient: HttpClient, cookie: Cookie, appInsightsService: AppInsightsService,) {
        super(httpClient, environment.ApiUrl, Controllers.User, cookie, appInsightsService);
    }

    GetUserList(model: userlistrequest): Observable<BaseResponse<UserList>> {
        return this.post<userlistrequest, UserList>(model, Action.list);
    }

    DeleteUser(userId: string): Observable<BaseResponse<Int16Array>> {
        return this.delete<Int16Array>(userId, '');
    }

    getUserById(id: number): Observable<BaseResponse<UserModel>> {
        return this.get<UserModel>(id, '');
    }

    updateUser(id: number, model: userAddUpdateRequest) {
        return this.put<userAddUpdateRequest>(id, '', model);
    }    

    addUser(model: userAddUpdateRequest) {
        return this.post<userAddUpdateRequest, BaseResponse<Int16Array>>(model, '');
    }   
}

