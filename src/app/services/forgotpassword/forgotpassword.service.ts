import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cookie } from '../cookie.service';
import { AppInsightsService } from '../app-insights.service';
import { CoreDataService } from '../core-data.service';
import { environment } from '../../../environments/environment';
import { Controllers } from '../../views/shared/controller'
import { BaseResponse } from '../../models/core/baseResponse.model';
import { forgotpasswordRequest } from '../../models/request/forgotpassword/forgotpasswordRequest.model';

@Injectable({
    providedIn: 'root'
})
export class ForgotPasswordService extends CoreDataService {
    constructor(httpClient: HttpClient, cookie: Cookie, appInsightsService: AppInsightsService,) {
        super(httpClient, environment.ApiUrl, Controllers.ForgotPassword, cookie, appInsightsService);
    }
    
    forgotPassword(model: forgotpasswordRequest) {
        return this.post<forgotpasswordRequest, BaseResponse<Int16Array>>(model, '');
    } 
  
}

