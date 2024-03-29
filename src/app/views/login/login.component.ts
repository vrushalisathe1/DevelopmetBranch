import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription, filter, takeUntil } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { Spinkit } from 'ng-http-loader';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { BaseResponse } from '../../models/core/baseResponse.model';
import { Cookie } from '../../services/cookie.service';
import { CookieConstant } from '../shared/cookieConstant';
import { UserResponse } from '../../models/response/user/userResponse.model';
import { NotificationType } from '../shared/constants';
import { UserService } from '../../services/user/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import {MSAL_GUARD_CONFIG,MsalBroadcastService,MsalGuardConfiguration,MsalService,} from '@azure/msal-angular';
import {AuthError,AuthenticationResult,EventMessage,EventType,InteractionType,PopupRequest,RedirectRequest,} from '@azure/msal-browser';
import { LoginService } from '../../services/login/login.service';
import { ForgotPasswordService } from '../../services/forgotpassword/forgotpassword.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, SharedModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {
  private readonly _destroying$ = new Subject<void>();
  public spinkit = Spinkit;
  public loggedIn: boolean = false;
  public userGetResponse$: Observable<BaseResponse<UserResponse>>;
  public subscriptions = new Subscription();
  public notificationType = new NotificationType();
  public isCustomLogin: boolean = false;
  public userForm: FormGroup;
  public forgotpasswordform: FormGroup;
  public isSubmitted: boolean = false;
  checked: boolean = false;
  public visible: boolean = false;

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,private authService: MsalService,private msalBroadcastService: MsalBroadcastService,
    private router: Router,private cookie: Cookie,private messageService: MessageService,public Translator: TranslateService,
    public userService: UserService,private fb: FormBuilder,private loginService: LoginService,private forgotpassword: ForgotPasswordService
  ) {}

  ngOnInit(): void {
    this.loggedIn = this.authService.instance.getAllAccounts().length > 0 ? true : false;
    this.msalBroadcastService.msalSubject$
      .pipe(filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_FAILURE),takeUntil(this._destroying$))
      .subscribe((result: EventMessage) => {
        if (result.error instanceof AuthError) {
          let message ='Login Failed for - ' + this.cookie.GetCookie(CookieConstant.cal_Email);
          this.messageService.add({severity: this.notificationType.error,summary: this.Translator.instant('lblError'),detail: this.Translator.instant(message)});
        };
      });

    this.msalBroadcastService.msalSubject$
      .pipe(filter((msg: EventMessage) =>msg.eventType === EventType.LOGIN_SUCCESS || msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS), takeUntil(this._destroying$))
      .subscribe((result) => {});

    this.authService.handleRedirectObservable().subscribe({
      next: (result: AuthenticationResult) => {
        if (result) {
          this.cookie.SetCookie(CookieConstant.cal_UserName,result.account.name);
          this.cookie.SetCookie(CookieConstant.cal_Email,result.account.username);
          this.cookie.SetCookie(CookieConstant.cal_HomeAccountId,result.account.homeAccountId);
          this.cookie.SetCookie(CookieConstant.cal_Token, result.idToken);
          this.cookie.SetCookie(CookieConstant.cal_RoleID, '41');
          this.router.navigateByUrl('dashboard');
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
    this.setFormBuilder();
  }

  getDomainName(hostName) {
    return hostName.substring(hostName.lastIndexOf('.', hostName.lastIndexOf('.') - 1) + 1);
  }

  ssoLogin() {
    this.router.navigateByUrl('dashboard');
    this.loggedIn = this.authService.instance.getAllAccounts().length > 0;
    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      if (this.msalGuardConfig.authRequest) {
        this.authService.loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
          });
      } else {
        this.authService.loginPopup().subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
          });
      }
    } else {
      if (this.msalGuardConfig.authRequest) {
        this.authService.loginRedirect({...this.msalGuardConfig.authRequest,} as RedirectRequest);
      } else {
        this.authService.loginRedirect();
      }
    }
  }

  setFormBuilder() {
    (this.userForm = this.fb.group({
      UserName: ['',Validators.compose([Validators.required, Validators.maxLength(200)])],
      Password: ['',Validators.compose([Validators.required, Validators.maxLength(32)])],
    })),
    (this.forgotpasswordform = this.fb.group({
      UserName: ['',Validators.compose([Validators.required, Validators.maxLength(200)])],
      Email: ['', Validators.compose([Validators.email, Validators.required, Validators.maxLength(100)])]
    }));
  }
  customLogin() {
    this.router.navigateByUrl('dashboard');
    this.isSubmitted = true;
    // this.router.navigateByUrl('');
    if (this.userForm.invalid) {
      return;
    } else {
      let obj: any = {};
      obj = this.userForm.getRawValue();
      this.subscriptions.add(this.loginService.GetUserAuth(obj.UserName, obj.Password).subscribe((d: any) => {
            if (d.data && d.data.JwtToken ) {
              this.cookie.SetCookie(CookieConstant.cal_UserName, d.data.UserID);
              this.cookie.SetCookie(CookieConstant.cal_Email, d.data.Email);
              this.cookie.SetCookie(CookieConstant.cal_RoleID, d.data.RoleID);
              this.cookie.SetCookie(CookieConstant.cal_Token, d.data.JwtToken);
              this.router.navigateByUrl('dashboard');
            } 
            else {
              let message = 'please enter valid username or password';
              this.messageService.add({severity: this.notificationType.error, summary: 'Error',detail: this.Translator.instant(message)});
            }
          }))
    }
  }

  onKeyPress(event:KeyboardEvent){
    if(event.key==="Enter"){
      event.preventDefault();
      this.customLogin();
    }
  }

  ngOnDestroy(): void {
    this._destroying$.next(null);
    this._destroying$.complete();
    this.subscriptions.unsubscribe();
  }

  showDialog() {
    this.visible = true;
    this.forgotpasswordform.reset();
    this.isSubmitted = false;
  }

  closeDialog() {
    this.visible = false;
  }

  onforgotpassword() {
    this.isSubmitted = true;
    if (this.forgotpasswordform.invalid) {
      return;
    } else {
      let obj: any = {};
      obj = this.forgotpasswordform.getRawValue();
      this.subscriptions.add(this.forgotpassword.forgotPassword(obj).subscribe((response:any) => {
                if (response.data) {
                    this.messageService.add({ severity: 'success', summary: 'Updated Successfully!!!', detail: 'Updated Successfully!!!' });
                    this.visible = false;
                    this.forgotpasswordform.reset();
                }
                else {
                  let message = 'please enter valid username or email';
                  this.messageService.add({severity: this.notificationType.error, summary: 'Error', detail: this.Translator.instant(message),});
                }
            }));
          }
        }
      }
