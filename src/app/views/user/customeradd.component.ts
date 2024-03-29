import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { KeyValue } from '../../models/core/keyvalue.model';
import { RoleService } from '../../services/role/role.service';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

@Component({
    selector: 'app-customeradd',
    standalone: true,
    imports: [CommonModule, RouterModule, SharedModule],
    templateUrl: './customeradd.component.html',
})
export class CustomeraddComponent implements OnInit {

    public isArrowUp: boolean = false;
    public userform: FormGroup;
    public isSubmitted: boolean = false;
    public permissionList: Array<KeyValue> = [];
    public plantList: Array<KeyValue> = [];
    private subscriptions = new Subscription();

    constructor(private fb: FormBuilder, private userServie: UserService, private messageService: MessageService,
        private router: Router, private roleService: RoleService) {
    }

    ngOnInit(): void {
        this.setUserFormBuilder();
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
            UserNum: [''],
            FirstName: ['', Validators.required],
            LastName: ['', Validators.required],
            Email: ['', Validators.compose([Validators.email, Validators.required, Validators.maxLength(100)])],
            EmailNotification: [false],
            Phone: ['', Validators.compose([Validators.required])],
            UserName: ['', Validators.required],
            Password: ['', Validators.required],
            RoleID: [0, [Validators.required, Validators.min(1)]],

        });
    }

    onSave() {
        this.isSubmitted = true;
        if (this.userform.invalid) {
            return;
        } else {
            let obj: any = {};
            obj = this.userform.getRawValue();
            this.subscriptions.add(this.userServie.addUser(obj).subscribe(
                (response) => {
                    this.messageService.add({ severity: 'success', summary: 'Saved Successfully!!!', detail: 'Data Saved Successfully' })
                    this.router.navigate(['/user']);
                    this.userform.reset();
                }
            ));
        }
    }

    resetForm() {
        this.userform.reset({ EmailNotification: false });
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}


