import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MessageService } from 'primeng/api';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import { ErrorHttpService } from './services/error-http.service';
import { CookieService } from 'ngx-cookie-service';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { environment } from '../environments/environment';
import { IPublicClientApplication, PublicClientApplication, BrowserCacheLocation, LogLevel, InteractionType } from '@azure/msal-browser';
import { MsalGuard, MsalInterceptor, MsalBroadcastService, MsalService, MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG, MsalInterceptorConfiguration, MsalGuardConfiguration } from '@azure/msal-angular';
import { AppInsightsService } from './services/app-insights.service';



const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;
export function loggerCallback() { }

export function httpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

export function MSALInstanceFactory(): IPublicClientApplication {
    return new PublicClientApplication({
        auth: {
            clientId: environment.clientID,
            redirectUri: '/login',
            postLogoutRedirectUri: environment.logoutURL + '/login',
            navigateToLoginRequestUrl: true,
            authority: environment.authority
        },
        cache: {
            cacheLocation: BrowserCacheLocation.LocalStorage,
            storeAuthStateInCookie: isIE, // set to true for IE 11
        },
        system: {
            loggerOptions: {
                loggerCallback,
                logLevel: LogLevel.Info,
                piiLoggingEnabled: false
            }
        }
    });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
    const protectedResourceMap = new Map<string, Array<string>>();
    protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', ['user.read']);

    return {
        interactionType: InteractionType.Redirect,
        protectedResourceMap
    };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
    return { interactionType: InteractionType.Redirect, authRequest: { prompt: 'select_account' } };
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideClientHydration(),
        provideAnimations(),
        provideHttpClient(
            withFetch(),
            withInterceptorsFromDi()
        ),
        importProvidersFrom(
            NgHttpLoaderModule.forRoot(),
            TranslateModule.forRoot({ loader: { provide: TranslateLoader, useFactory: httpLoaderFactory, deps: [HttpClient] } })
        ),
        { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true },
        { provide: MSAL_INSTANCE, useFactory: MSALInstanceFactory },
        { provide: MSAL_GUARD_CONFIG, useFactory: MSALGuardConfigFactory },
        { provide: MSAL_INTERCEPTOR_CONFIG, useFactory: MSALInterceptorConfigFactory },
        { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorHttpService, multi: true },
        MsalService, MsalGuard, MsalBroadcastService, AppInsightsService,
        MessageService, JwtHelperService, DatePipe, CookieService
    ]
};
