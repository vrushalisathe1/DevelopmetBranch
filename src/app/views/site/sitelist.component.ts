import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject, Subscription } from 'rxjs';
import { RoleService } from '../../services/role/role.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormBuilder } from '@angular/forms';
import { rolelistResponse } from '../../models/response/role/rolelist.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ExportService } from '../../services/export.service';
import { NotificationType } from '../shared/constants';
import { TranslateService } from '@ngx-translate/core';
import { Table } from '../shared/table';

@Component({
    selector: 'app-sitelist',
    standalone: true,
    imports: [CommonModule, RouterModule, SharedModule],
    templateUrl: './sitelist.component.html'
})


export class SiteListComponent implements OnInit {
    isSubmitted:boolean=false;
    public totalCount: number = 0;
    public first: number = 0;
    public Role=new rolelistResponse();
    public pageState: any;
    public subscriptions = new Subscription();
    public displayRolePopup: boolean = false;
    public RoleName: string;
    public search = new Subject<string>();
    public RoleId: number = 0;
    public notificationType = new NotificationType();
    @ViewChild('dt') table: Table;
    constructor(private fb: FormBuilder,private roleService: RoleService, private messageService: MessageService,private exportService: ExportService, public Translator: TranslateService) { }

    ngOnInit(): void {}

    bindRoleList() {
        let obj: any = {};
        obj.pageNo = this.pageState && this.pageState.first && this.pageState.rows ? (this.pageState.first / this.pageState.rows) + 1 : 1;
        obj.pageSize = this.pageState && this.pageState.rows ? this.pageState.rows : 25;
        obj.sortingType = this.pageState && this.pageState.sortOrder == -1 ? "DESC" : "ASC";
        obj.sortingColumnName = this.pageState && this.pageState.sortField ? this.pageState.sortField : "NAME";
        obj.searchrole = this.RoleName;
        this.subscriptions.add(this.roleService.GetRoleTotal(obj).subscribe((d: any) => {
            this.Role.RoleList = d.data.RoleList;
            this.Role.totalCount = d.data.totalCount;
        }));
    }

   
    exportExcel() {
        let role = this.Role.RoleList.map(d=>({
         RollName: d.name,       
        }));  

        this.exportService.exportExcel(role, "RoleList");      
    }
  
    exportPdf() {
        const columns = [
            { header: 'Role Name', dataKey: 'name' },
           
        ];
        this.exportService.exportPdf(this.Role.RoleList, columns, "RoleList.pdf");
    }

    loadDetails(event) {
        this.pageState = event;
        this.bindRoleList();
    }

    showRolePopup(RoleId: number) {
        this.RoleId = RoleId;
        this.displayRolePopup = true;
    }


    clear() {
        this.RoleName = "";
        this.table.reset();
    }

    deleteRole() {
        this.subscriptions.add(this.roleService.DeleteRole(this.RoleId).subscribe((response) => {
            if (response.data) {
                this.messageService.add({ severity: 'error', summary: 'Delete', detail: 'Data Deleted' });
                this.bindRoleList();
                this.displayRolePopup = false;
            } else {
                this.displayRolePopup = false;
                let message = 'As a precaution, this role cannot be deleted as there are users assigned to it.\n Each user record must be edited to remove this role (assign to another role).';
                this.messageService.add({sticky: true,severity: this.notificationType.error, summary: 'Error', detail: this.Translator.instant(message),});
              }
        }));
    }
    

    ngAfterViewInit(): void {
        this.search.pipe(debounceTime(500), distinctUntilChanged()).subscribe((value) => this.bindRoleList());
    }

    onSearchRoleName() {
        this.table?.reset();
        this.search.next(this.RoleName);
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

}
