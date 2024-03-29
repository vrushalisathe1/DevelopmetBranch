import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { NotificationType } from '../views/shared/constants';
import { MenusItem } from '../models/core/menu.model';
import { Cookie } from './cookie.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { PublicClientApplication } from '@azure/msal-browser';
import { CookieConstant } from '../views/shared/cookieConstant';
import { MsalService } from '@azure/msal-angular';

@Injectable({
    providedIn: 'root'
})
export class SystemService {
    public stateStorage: string = "cookie";
    public notificationType = new NotificationType();
    public subscriptions = new Subscription();

    constructor(public Translator: TranslateService, private messageService: MessageService,
        private http: HttpClient, private cookie: Cookie, private router: Router, private authService: MsalService) { }

    getMenuItem() {
        return this.http.get<any>('assets/menu.json').toPromise().then(res => <MenusItem[]>res.data).then(data => { return data; });
    }

    // logout() {
    //     let config = {
    //         auth: {
    //             clientId: environment.clientID,
    //             redirectUri: environment.logoutURL + '/login',
    //             postLogoutRedirectUri: environment.logoutURL + '/login',
    //         },
    //     };
    //     const myMsal = new PublicClientApplication(config);
    //     const logoutRequest = {
    //         account: myMsal.getAccountByHomeId(this.cookie.GetCookie(CookieConstant.cal_HomeAccountId)),
    //         mainWindowRedirectUri: environment.logoutURL + '/login',
    //         redirectUri: environment.logoutURL + '/login',
    //     };
    //     this.cookie.DeleteAllCookies();
    //     sessionStorage.clear();
    //     localStorage.clear();
    //     this.authService.handleRedirectObservable().subscribe(x => {
    //         this.router.navigate(['/login']);
    //     });

    // }

    copy(data) {
        return JSON.parse(JSON.stringify(data));
    }
    showError(message) {
        this.messageService.clear();
        this.messageService.add({ severity: this.notificationType.error, summary: this.Translator.instant('lblError'), detail: this.Translator.instant(message) });
    }
    showWarning(message) {
        this.messageService.clear();
        this.messageService.add({ severity: this.notificationType.warn, summary: this.Translator.instant('lblWarn'), detail: this.Translator.instant(message) });
    }
    showSuccess(message) {
        this.messageService.clear();
        this.messageService.add({ severity: this.notificationType.success, summary: this.Translator.instant('lblSuccess'), detail: this.Translator.instant(message) });
    }

}
