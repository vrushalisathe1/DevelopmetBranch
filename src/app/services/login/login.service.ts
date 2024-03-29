import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cookie } from '../cookie.service';
import { AppInsightsService } from '../app-insights.service';
import { Observable } from 'rxjs';
import { CoreDataService } from '../core-data.service';
import { Action } from '../../views/shared/action';
import { environment } from '../../../environments/environment';
import { Controllers } from '../../views/shared/controller';
import { BaseResponse } from '../../models/core/baseResponse.model';

@Injectable({
    providedIn: 'root'
})
export class LoginService extends CoreDataService {
    constructor(httpClient: HttpClient, cookie: Cookie, appInsightsService: AppInsightsService,) {
        super(httpClient, environment.ApiUrl, Controllers.Login, cookie, appInsightsService);
    }    

    GetUserAuth(username: string, password: string): Observable<BaseResponse<number>> {
        let obj: any = {};
        obj.username = username;
        obj.password = password;
        return this.post<any, number>(obj, Action.userauth);
    }
}

