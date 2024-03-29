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
import { resetpasswordRequest } from '../../models/request/resetpassword/resetpasswordRequest.model';

@Injectable({
    providedIn: 'root'
})
export class ResetPasswordService extends CoreDataService {
    constructor(httpClient: HttpClient, cookie: Cookie, appInsightsService: AppInsightsService,) {
        super(httpClient, environment.ApiUrl, Controllers.ResetPassword, cookie, appInsightsService);
    }

    reset(model: resetpasswordRequest) {
        return this.post<resetpasswordRequest, BaseResponse<Int16Array>>(model, '');
    } 
  
}

