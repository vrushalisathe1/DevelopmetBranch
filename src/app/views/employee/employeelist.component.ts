import { Component, OnInit } from '@angular/core';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { KeyValue } from '../../models/core/keyvalue.model';
import { MessageService } from 'primeng/api';
import * as FileSaver from 'file-saver';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { rolodexutilityResponse } from '../../models/response/employee/rolodexutilitylist.model';
import { RolodexModel } from '../../models/response/employee/rolodex.model';
import { EmployeeService } from '../../services/employee/employee.service';
import { ExportService } from '../../services/export.service';

@Component({
    selector: 'app-employeelist',
    standalone: true,
    imports: [CommonModule, RouterModule, SharedModule],
    templateUrl: './employeelist.component.html'
})
export class EmployeeListComponent implements OnInit {

    public totalCount: number = 0;
    public first: number = 0;
    public RolodexUtilityList: rolodexutilityResponse[];
    public pageState: any;
    private subscriptions = new Subscription();
    public departmentList: Array<KeyValue> = [];
    public displayRolodexPopup: boolean = false;
    public CommId: number = 0;
    public FindEmpNo: string;
    public FindLastName: string;
    public search = new Subject<string>();
    constructor(private employeeService: EmployeeService, private messageService: MessageService,private exportService: ExportService) { }

    ngOnInit(): void {
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

    bindRolodexUtilityList() {
        let obj: any = {};
        obj.pageNo = this.pageState && this.pageState.first && this.pageState.rows ? (this.pageState.first / this.pageState.rows) + 1 : 1;
        obj.pageSize = this.pageState && this.pageState.rows ? this.pageState.rows : 25;
        obj.sortingType = this.pageState && this.pageState.sortOrder == -1 ? "DESC" : "ASC";
        obj.sortingColumnName = this.pageState && this.pageState.sortField ? this.pageState.sortField : "FNAME";
        obj.searchempno = this.FindEmpNo;
        obj.searchlastname = this.FindLastName;
        this.subscriptions.add(this.employeeService.GetRolodexUtilityList(obj).subscribe((d: any) => {
            if (d.data) {
                d.data.EmployeesList.forEach((item) => {
                    item.DepartmentName = this.departmentList.find(x => x.value == item.DepartmentId).name;                  
                });
                this.RolodexUtilityList = d.data.EmployeesList;
                this.totalCount = d.data.totalCount;
            }
        }))
    }

    loadDetails(event) {
        this.pageState = event;
        this.bindRolodexUtilityList();
    }
    showRolodexPopup(CommId: number) {
        this.CommId = CommId;
        this.displayRolodexPopup = true;
    }
    deleteRolodex() {
        this.subscriptions.add(this.employeeService.DeleteRolodex(this.CommId).subscribe((response) => {
            this.messageService.add({ severity: 'error', summary: 'Delete', detail: 'Data Deleted' });
            this.bindRolodexUtilityList();
            this.displayRolodexPopup = false;
        }));
    }
    onSearchEmpNo() {
        this.FindLastName = null;
        this.search.next(this.FindEmpNo);
    }
    ngAfterViewInit(): void {
        this.search.pipe(debounceTime(500), distinctUntilChanged()).subscribe((value) => this.bindRolodexUtilityList());
    }
    onSearchLastName() {
        this.FindEmpNo = null;
        this.search.next(this.FindLastName);
    }

    exportExcel() {
        import("xlsx").then(xlsx => {
            const datePipe = new DatePipe('en-US');
           
            const formattedData = (this.RolodexUtilityList as unknown as RolodexModel[]).map(item => {
                const numericDate = item.Hiredate;
                const formattedDate = numericDate ? datePipe.transform(new Date(numericDate), 'MM/dd/yyyy') : '';
                return { ...item, Hiredate: { t: 'd', v: new Date(numericDate), z: xlsx.SSF._table[14] } };
            });
   
            const worksheet = xlsx.utils.json_to_sheet(formattedData);
            const workbook = { Sheets: { 'EmployeeDetails': worksheet }, SheetNames: ['EmployeeDetails'] };
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, "RolodexUtilityList");
        });
    }
    saveAsExcelFile(buffer: any, fileName: string): void {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }
    exportPdf() {
        const columns = [                  
          { header: 'Employee Number', dataKey: 'EmployeeNumber' },
          { header: 'First Name', dataKey: 'FirstName' },
          { header: 'Last Name', dataKey: 'LastName' },
          { header: 'Middle Name', dataKey: 'MiddleName' },
          { header: 'Department Name', dataKey: 'DepartmentName' },
                  
       ];   
        this.exportService.exportPdf(this.RolodexUtilityList,columns,"RolodexUtilityList.pdf"); 
    } 

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
