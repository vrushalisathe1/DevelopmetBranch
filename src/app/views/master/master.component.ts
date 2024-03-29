import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Spinkit } from 'ng-http-loader';
import { TranslateService } from '@ngx-translate/core';
import { Cookie } from '../../services/cookie.service';
import { CookieConstant } from '../shared/cookieConstant';
import { MenuItem, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { SystemService } from '../../services/system.service';
import { LeftmenuComponent } from './leftmenu.component';
import { FormBuilder, FormGroup, MinLengthValidator, Validators } from '@angular/forms';
import { ResetPasswordService } from '../../services/resetpassword/resetpassword.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-master',
    standalone: true,
    imports: [CommonModule, RouterModule, SharedModule, LeftmenuComponent],
    templateUrl: './master.component.html'
})
export class MasterComponent implements OnInit {
    public spinkit = Spinkit;
    public selectedLang: string = this.cookie.GetCookie(CookieConstant.cal_SelectedLanguage) || 'en';
    public items: MenuItem[];
    public Resetform: FormGroup;
    public isSubmitted: boolean = false;
    public registerForm: FormGroup;
    public subscriptions = new Subscription();
    public submitted:boolean = false;
    public UserName = this.cookie.GetCookie(CookieConstant.cal_UserName);
    public classToggled :boolean = false;
    public displayreset: boolean = false;

    constructor(public router: Router, private cookie: Cookie, public translateService: TranslateService, private systemService: SystemService, private resetpassword: ResetPasswordService, private messageService: MessageService, private fb: FormBuilder, private formBuilder: FormBuilder) {
        this.translateService.setDefaultLang(this.selectedLang);
        this.translateService.use(this.selectedLang);
    }

    ngOnInit() {
        this.items = [
            {
                label: 'Profile', icon: 'pi pi-fw pi-user'
            },
            {
                label: 'Reset Password', icon: 'pi pi-key', command: () => {
                    this.showDialog();
                }
            },
            { separator: true },
            {
                label: 'Logout', icon: 'pi pi-cog', command: () => {
                    // this.systemService.logout();
                }
            }
        ];
        this.setResetFormBuilder();
    }    

    showDialog() {
        this.Resetform.reset();
        this.isSubmitted = false;
        this.displayreset = true;
    }

    closeDialog() {
        this.displayreset = false;
    }

    resetDialog() {
        this.isSubmitted = true;     
        if (this.Resetform.invalid) {
            return;
        }
        else if (!(this.Resetform.get('newpassword').value == this.Resetform.get('confirmPassword').value)) {
            this.messageService.add({ severity: 'error', summary: 'Data MissMatch !!!', detail: 'The new password and confirm password do not match. Please try again.' });
        }
        else {
            let obj: any = { newpassword: this.Resetform.get('newpassword').value, password: this.Resetform.get('password').value };
            this.subscriptions.add(this.resetpassword.reset(obj).subscribe(
                (response) => {
                    if (response.data) {
                        this.messageService.add({ severity: 'success', summary: 'Updated Successfully!!!', detail: 'Your password has been successfully reset!' })
                        this.Resetform.reset();
                        this.displayreset = false;
                    }
                }
            ));
        }
        this.isSubmitted = false;
    }

    public toggleField() {
        this.classToggled = !this.classToggled;
    }

    setResetFormBuilder() {
        this.Resetform = this.fb.group({
            password: ['', [Validators.required, Validators.minLength(3)]],
            newpassword: ['', [Validators.required, Validators.minLength(3)]],
            confirmPassword: ['', [Validators.required, Validators.minLength(3)]],
        });
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}

