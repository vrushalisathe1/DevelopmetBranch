import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Cookie } from './services/cookie.service';
import { CookieConstant } from './views/shared/cookieConstant';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class Authguard  {
    public defered = new Deferred<boolean>();
    constructor(private http: HttpClient, private router: Router, private cookie: Cookie, private jwtHelper: JwtHelperService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        this.defered = new Deferred<boolean>();
        this.router.navigateByUrl(" ")
        const currentUserId = this.cookie.GetCookie(CookieConstant.cal_Email);
        if (currentUserId && currentUserId != null) {
            this.defered.resolve(true);
        }
        // else {
        //     //Without Login
        //     this.cookie.DeleteAllCookies();
        //     window.location.href = environment.logoutURL + '/login';
        //     this.defered.resolve(false);
        //     return this.defered.promise;
        // }
        return this.defered.promise;
    }
}

class Deferred<T> {
    promise: Promise<T>;
    resolve: (value?: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
    constructor() {
        this.promise = new Promise<T>((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}
