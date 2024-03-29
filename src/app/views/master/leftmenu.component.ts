import { Component, OnInit } from '@angular/core';
import { CookieConstant } from '../shared/cookieConstant';
import { Cookie } from '../../services/cookie.service';
import { RoleService } from '../../services/role/role.service';
import { Subscription } from 'rxjs';
import { MenusItem } from '../../models/core/menu.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

@Component({
    selector: 'app-leftmenu',
    standalone: true,
    imports: [CommonModule, RouterModule, SharedModule],
    templateUrl: './leftmenu.component.html'
})
export class LeftmenuComponent implements OnInit {

    public roleID: number = this.cookie.GetCookie(CookieConstant.cal_RoleID);
    private subscriptions = new Subscription();
    menuItems: MenusItem[] = [];
    constructor(private cookie: Cookie, private roleService: RoleService) { }

    ngOnInit() {
        this.getRoleById();
    }

    getRoleById() {
        this.subscriptions.add(this.roleService.getRoleById(this.roleID).subscribe(d => {
            if (d.data) {
                this.menuItems = JSON.parse(d.data.Content);
            }            
        }));
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    

}
