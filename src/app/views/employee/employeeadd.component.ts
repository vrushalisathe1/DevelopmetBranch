
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KeyValue } from '../../models/core/keyvalue.model';
import { CommonModule, formatDate } from '@angular/common';
import { MessageService } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { EmployeeService } from '../../services/employee/employee.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-employeeadd',
    standalone: true,
    imports: [CommonModule, RouterModule, SharedModule],
    templateUrl: './employeeadd.component.html'
})
export class EmployeeAddComponent implements OnInit {

    public isArrowUp: boolean = false;
    minStartDate: any;
    maxStartDate: any;

    public rolodexForm: FormGroup
    public isSubmitted: boolean = false;
    public departmentList: Array<KeyValue> = [];
    private subscriptions = new Subscription();
    constructor(private fb: FormBuilder, private employeeService: EmployeeService, private messageService: MessageService,
        private router: Router) { }

    ngOnInit(): void {
        this.setFormBuilder();
        const currentDate: Date = new Date();
        this.minStartDate = { year: currentDate.getFullYear() - 2, month: 1, day: 1 };
        this.departmentList = [
            { name: 'Inform', value: 1 },
            { name: 'Wareho', value: 2 },
            { name: 'SHIPPI', value: 3 },
            { name: 'Vinyl', value: 4 },
            { name: 'Wood S', value: 5 },
            { name: 'Caseme', value: 6 },
            { name: 'Slider', value: 7 },
            { name: 'ASM Sc', value: 8 }
        ];
    }

    setFormBuilder() {
        this.rolodexForm = this.fb.group({
            Comm: [0],
            EmployeeNumber: ["", Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])],
            FirstName: ["", [Validators.required]],
            LastName: ["", [Validators.required]],
            MiddleName: ["", [Validators.required]],
            HireDate: ["", [Validators.required]],
            JobCode: ["", [Validators.required]],
            DepartmentId: ["", [Validators.required]]
        });
    }

    rolodexSave() {
        this.isSubmitted = true;
        if (this.rolodexForm.invalid) {
            return;
        } else {
            let obj: any = {};
            obj = this.rolodexForm.getRawValue();
            var convertToDBFormatHireDate = new Date(obj.HireDate.year, obj.HireDate.month - 1, obj.HireDate.day);
            obj.HireDate = formatDate(new Date(convertToDBFormatHireDate), 'dd-MM-yy HH:mm:ss', 'en_US');
            this.subscriptions.add(this.employeeService.AddRolodex(obj).subscribe(
                (response) => {
                    this.messageService.add({ severity: 'success', summary: 'Saved Successfully!!!', detail: 'Data Saved Succesfully' })
                    this.router.navigate(['/employee']);
                    this.rolodexForm.reset();
                }
            ));
        }
    }

    resetRolodex() {
        this.rolodexForm.reset({ Comm: 0 });
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

}
