import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject, Subscription } from 'rxjs';
import { MenusItem } from '../../models/core/menu.model';
import { RoleService } from '../../services/role/role.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import * as FileSaver from 'file-saver';
import { UserResponse } from '../../models/response/user/userResponse.model';
import { UserService } from '../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ExportService } from '../../services/export.service';
import { Table } from '../shared/table';
import { KeyValue } from '../../models/core/keyvalue.model';


@Component({
    selector: 'app-customerlist',
    standalone: true,
    imports: [CommonModule, RouterModule, SharedModule],
    templateUrl: './customerlist.component.html',
})
export class CustomerlistComponent implements OnInit {
    public UserId: string;
    public totalCount: number = 0;
    public first: number = 0;
    public User= new UserResponse();
    public pageState: any;
    public displayuserPopup: boolean = false;
    private subscriptions = new Subscription();
    public FindUserNumber: string;
    public FindEmail: string;
  
    public search = new Subject<string>();
    public displayPermissionPopup: boolean = false;
    public menuItems: MenusItem[] = [];
    public chkRole: boolean = true;
    @ViewChild('dt') table: Table;
    public plantList: Array<KeyValue> = [];
    public plantID: number = 0;
    constructor(private messageService: MessageService,private userService: UserService, private roleService: RoleService,
        private exportService: ExportService) { }
      

    ngOnInit() {
        this.plantList = [
            { name: "Welcome, NC", value: 1 },
            { name: "Dallas, Texas", value: 2 }
        ];
        
 }

    bindUserList() {
        let obj: any = {};
        obj.pageNo = this.pageState && this.pageState.first && this.pageState.rows ? (this.pageState.first / this.pageState.rows) + 1 : 1;
        obj.pageSize = this.pageState && this.pageState.rows ? this.pageState.rows : 25;
        obj.sortingType = this.pageState && this.pageState.sortOrder == -1 ? "DESC" : "ASC";
        obj.sortingColumnName = this.pageState && this.pageState.sortField ? this.pageState.sortField : "FIRST_NAME";         
        obj.searchuserno = this.FindUserNumber;
        obj.searchemail = this.FindEmail;
        obj.plantID = this.plantID;
        this.subscriptions.add(this.userService.GetUserList(obj).subscribe((d: any) => {
            if (d.data) {
                this.User.userlist = d.data.UserList;
                this.User.totalCount = d.data.totalCount;
            }
        }));
    }

    changeplant() {
        debugger;
        this.bindUserList();
    }

    loadDetails(event) {
        this.pageState = event;
        this.bindUserList();
    }

    showUserPopup(UserId: string) {
        this.UserId = UserId;
        this.displayuserPopup = true;
    }

    deleteUser() {
        this.subscriptions.add(this.userService.DeleteUser(this.UserId).subscribe((response) => {
            this.messageService.add({ severity: 'error', summary: 'Delete', detail: 'Data Deleted' });
            this.bindUserList();
            this.displayuserPopup = false;
        }));
    }

    onSearchUserNumber() {
        this.table?.reset();
        this.FindEmail = null;
        this.search.next(this.FindUserNumber);
    }

    ngAfterViewInit(): void {
        this.search.pipe(debounceTime(500), distinctUntilChanged()).subscribe((value) => this.bindUserList());
    }

    onSearchFindEmail() {
        this.table?.reset();
        this.FindUserNumber = null;
        this.search.next(this.FindEmail);
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    getRoleById(roleID: number) {  
        this.displayPermissionPopup = true;
        this.subscriptions.add(this.roleService.getRoleById(roleID).subscribe(d => {
            if (d.data) {
                this.menuItems = JSON.parse(d.data.Content);                
            }
        }));
    }

    exportPdf() {
        const columns = [
            { header: 'First Name', dataKey: 'FirstName' },
            { header: 'Last Name', dataKey: 'LastName' },
            { header: 'Email', dataKey: 'Email' },
          ];
          this.exportService.exportPdf(this.User.userlist, columns, "userlist.pdf");
    }
    
  exportExcel() {
    const dataToExport = this.User.userlist.map(User => ({
        FirstName: User.FirstName,
        LastName: User.LastName,
        Email: User.Email,
      }));
  
      this.exportService.exportExcel(dataToExport, "userList");
  }
}
