
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KeyValue } from '../../models/core/keyvalue.model';
import { CommonModule, formatDate } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CustomValidator } from '../../services/custom-validator.service';
import { SharedModule } from '../shared/shared.module';
import { RolodexModel } from '../../models/response/employee/rolodex.model';
import { EmployeeService } from '../../services/employee/employee.service';
import { Subscription } from 'rxjs';


@Component({
    selector: 'app-employeeedit',
    standalone: true,
    imports: [CommonModule, RouterModule, SharedModule],
    templateUrl: './employeeedit.component.html'
})
export class EmployeEditComponent implements OnInit {

    public isArrowUp: boolean = false;
    minStartDate: any;
    maxStartDate: any;

    public rolodexForm: FormGroup
    public isSubmitted: boolean = false;
    public departmentList: Array<KeyValue> = [];
    public paramId: number = 0;
    public resetForm: RolodexModel;
    private subscriptions = new Subscription();
    constructor(private fb: FormBuilder, private employeeService: EmployeeService, private messageService: MessageService,
        private router: Router, private activatedroute: ActivatedRoute, private customValidator: CustomValidator) { }

    ngOnInit(): void {
        const currentDate: Date = new Date();
        this.minStartDate = { year: currentDate.getFullYear() - 2, month: 1, day: 1 };
        this.paramId = +this.activatedroute.snapshot.paramMap.get('id');

        this.setFormBuilder();
        this.getRolodexById();
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

    getRolodexById() {
        this.subscriptions.add(this.employeeService.getRolodexById(this.paramId).subscribe(d => {
            let converthireDate = this.customValidator.convertToMMDDYYYY(d.data.Hiredate);
            this.rolodexForm.setValue({
                Comm: d.data.Comm,
                EmployeeNumber: d.data.EmployeeNumber,
                FirstName: d.data.FirstName,
                LastName: d.data.LastName,
                MiddleName: d.data.MiddleName,
                HireDate: this.customValidator.convertDateToDateTimePicker(converthireDate),
                JobCode: d.data.JobCode,
                DepartmentId: d.data.DepartmentId
            });
            this.resetForm = this.rolodexForm.getRawValue();
        }));
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

    rolodexUpdate() {
        this.isSubmitted = true;
        if (this.rolodexForm.invalid) {
            return;
        } else {
            let obj: any = {};
            obj = this.rolodexForm.getRawValue();
            var convertToDBFormatHireDate = new Date(obj.HireDate.year, obj.HireDate.month - 1, obj.HireDate.day);
            obj.HireDate = formatDate(new Date(convertToDBFormatHireDate), 'dd-MM-yy HH:mm:ss', 'en_US');
            this.subscriptions.add(this.employeeService.UpdateRolodex(this.paramId, obj).subscribe(
                (response) => {
                    this.messageService.add({ severity: 'success', summary: 'Updated Successfully!!!', detail: 'Data Updated Succesfully' })
                    this.router.navigate(['/employee']);
                    this.rolodexForm.reset();
                }
            ))
        }
    }

    resetRolodex() {
        this.rolodexForm.patchValue(this.resetForm);
        this.subscriptions.unsubscribe();
    }

}
