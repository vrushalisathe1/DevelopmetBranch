import { Injectable } from '@angular/core';
import {
    HttpInterceptor, HttpRequest,
    HttpHandler, HttpEvent, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SystemService } from '../services/system.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AppInsightsService } from '../services/app-insights.service';
import { Cookie } from './cookie.service';
import { CookieConstant } from '../views/shared/cookieConstant';

@Injectable({
    providedIn: 'root'
})
export class ErrorHttpService implements HttpInterceptor {

    insightService: AppInsightsService;
    constructor(public system: SystemService, private cookie: Cookie, private jwtHelper: JwtHelperService, appInsightsService: AppInsightsService) {
        this.insightService = appInsightsService;
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let token = this.cookie.GetCookie(CookieConstant.cal_Token);

        return next.handle(request).pipe(catchError(err => {
            this.insightService.logException(err.error);
            if ([401, 403].includes(err.status) && this.jwtHelper.isTokenExpired(token)) {
                window.location.reload();
            } else {
                // auto logout if 401 or 403 response returned from api
                // this.system.logout();
            }
            const error = err.error?.message || err.statusText;
            //console.error(err);
            return throwError(() => error);
        }));
    }
}
