import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from './views/shared/shared.module';
import { NgHttpLoaderModule, Spinkit } from 'ng-http-loader';
import { SystemService } from './services/system.service';
import { CookieConstant } from './views/shared/cookieConstant';
import { environment } from '../environments/environment';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { TranslateService } from '@ngx-translate/core';
import { Cookie } from './services/cookie.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, SharedModule, NgHttpLoaderModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit  {

    public isIframe = false;
    public title: string = 'Cpesa Portal';
    public selectedLang: string;
    public spinkit = Spinkit;
    public idleState: string = "Not started.";
    public timedOut: boolean = false;

    constructor(public translateService: TranslateService, private cookie: Cookie,
        private system: SystemService, private idle: Idle) {
        this.cookie.SetCookie(CookieConstant.cal_SelectedLanguage, 'en');
        this.selectedLang = this.cookie.GetCookie(CookieConstant.cal_SelectedLanguage) || 'en';
        this.translateService.setDefaultLang(this.selectedLang);
        this.translateService.use(this.selectedLang);
    }

    ngOnInit() {
        this.isIframe = window !== window.parent && !window.opener;
        if (this.cookie.GetCookie(CookieConstant.cal_UserId))
            this.setTimeoutToLoggedInUser();
    }
    setTimeoutToLoggedInUser() {
        this.idle.setIdle(environment.setIdle);
        this.idle.setTimeout(environment.setIdle);
        this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

        this.idle.onIdleEnd.subscribe(() => (this.idleState = "No longer idle."));
        this.idle.onTimeout.subscribe(() => {
            this.idleState = "Timed out!";
            this.timedOut = true;
            // this.system.logout();
        });
        this.idle.onIdleStart.subscribe(
            () => (this.idleState = "You've gone idle!")
        );
        this.idle.onTimeoutWarning.subscribe(
            countdown => (this.idleState = "You will time out in " + countdown + " seconds!")
        );

        this.reset();
    }
    reset() {
        this.idle.watch();
        this.idleState = "Started.";
        this.timedOut = false;
    }
}
