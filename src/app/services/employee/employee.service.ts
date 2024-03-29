import { Injectable } from "@angular/core";
import { CoreDataService } from "../core-data.service";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Cookie } from "../cookie.service";
import { AppInsightsService } from "../app-insights.service";
import { environment } from "../../../environments/environment";
import { Observable, of } from "rxjs";
import { rolodexutilitylist } from "../../models/response/employee/rolodexutilitylist.model";
import { BaseResponse } from "../../models/core/baseResponse.model";
import { employeelistrequest } from "../../models/request/employee/employeelistrequest.model";
import { Action } from "../../views/shared/action";
import { Controllers } from "../../views/shared/controller";
import { RolodexAddUpdateRequest } from "../../models/request/employee/rolodexaddupdaterequest.model";
import { RolodexModel } from "../../models/response/employee/rolodex.model";


@Injectable({
    providedIn: 'root',
})
export class EmployeeService extends CoreDataService {

    constructor(httpClient: HttpClient, cookie: Cookie, appInsightsService: AppInsightsService,) {
        super(httpClient, environment.ApiUrl, Controllers.Employee, cookie, appInsightsService);
    }

    GetRolodexUtilityList(model: employeelistrequest): Observable<BaseResponse<rolodexutilitylist>> {
        return this.post<employeelistrequest, rolodexutilitylist>(model, Action.list);
    }

    AddRolodex(model: RolodexAddUpdateRequest) {
        return this.post<RolodexAddUpdateRequest, BaseResponse<Int16Array>>(model, '');
    }

    UpdateRolodex(id: number, model: RolodexAddUpdateRequest) {
        return this.put<RolodexAddUpdateRequest>(id, '', model);
    }

    DeleteRolodex(Comm: number): Observable<BaseResponse<Int16Array>> {
        return this.delete<Int16Array>(Comm, '');
    }

    getRolodexById(id: number): Observable<BaseResponse<RolodexModel>> {
        return this.get<RolodexModel>(id, '');
    }
}