import { Component, OnInit } from '@angular/core';
import { SystemService } from '../../services/system.service';


@Component({
    selector: 'app-logout',
    template: '',
})
export class LogoutComponent implements OnInit {

    constructor(private service: SystemService) {
        // this.service.logout();
    }

    ngOnInit(): void { }

}