import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { KeyValue } from '../../models/core/keyvalue.model';
import { Subscription } from 'rxjs';
import { RoleService } from '../../services/role/role.service';
import { UserModel } from '../../models/response/user/user.model';
import { UserService } from '../../services/user/user.service';
import { CustomValidator } from '../../services/custom-validator.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

@Component({
    selector: 'app-customeredit',
    standalone: true,
    imports: [CommonModule, RouterModule, SharedModule],
    templateUrl: './customeredit.component.html',
})
export class CustomerupdateComponent implements OnInit {

    public isArrowUp: boolean = false;
    public userform: FormGroup;
    public isSubmitted: boolean = false;
    public paramId: number = 0;
    public resetForm: UserModel;
    public permissionList: Array<KeyValue> = [];
    private subscriptions = new Subscription();
    public plantList: Array<KeyValue> = [];
    constructor(private fb: FormBuilder, public userService: UserService,
        private router: Router, private route: ActivatedRoute, private customValidator: CustomValidator,
        private messageService: MessageService, private roleService: RoleService) {

    }

    ngOnInit(): void {
        this.paramId = +this.route.snapshot.paramMap.get('id');
        this.setUserFormBuilder();
        this.loadUserData();
        this.bindRoleList();
        this.plantList = [
            { name: "Welcome, NC", value: 1 },
            { name: "Dallas, Texas", value: 2 }
        ];
    }

    bindRoleList() {
        this.subscriptions.add(this.roleService.GetRoleList().subscribe((d: any) => {
            this.permissionList = d.data.map(d => { return { name: d.name, value: d.roleid } });
        }));
    }

    setUserFormBuilder() {
        this.userform = this.fb.group({
            PlantID: [0, [Validators.required, Validators.min(1)]],
            UserNum: ['', Validators.required],
            FirstName: ['', Validators.required],
            LastName: ['', Validators.required],
            Email: ['', Validators.required],
            EmailNotification: [false],
            Phone: ['', Validators.compose([Validators.required])],
            UserName: ['', Validators.required],
            Password: ['', Validators.required],
            RoleID: [0, [Validators.required, Validators.min(1)]],
        });
    }

    loadUserData(): void {
        this.subscriptions.add(this.userService.getUserById(this.paramId).subscribe(d => {       
            if (d.data) {
                this.userform.setValue({
                    PlantID: d.data.PlantID,
                    UserNum: d.data.UserNum,
                    FirstName: d.data.FirstName,
                    LastName: d.data.LastName,
                    Email: d.data.Email,
                    UserName: d.data.UserName,
                    EmailNotification: d.data.EmailNotification == 1 ? true : false,
                    Phone: d.data.Phone,
                    RoleID: d.data.RoleID,
                    Password: d.data.Password,
                });
                this.resetForm = this.userform.getRawValue();
            }
        }))
    }

    updateUser(): void {
        this.isSubmitted = true;
        if (this.userform.invalid) {
            return;
        } else {
            let obj: any = {};
            obj = this.userform.getRawValue();
            this.userService.updateUser(this.paramId, obj).subscribe(
                (response) => {
                    this.messageService.add({ severity: 'success', summary: 'Updated Successfully!!!', detail: 'Data Updated Successfully' })
                    this.router.navigate(['/user']);
                    this.userform.reset({ RoleID: 0 });
                }
            )
        }
    }

    resetUser() {
        this.userform.patchValue(this.resetForm);
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
