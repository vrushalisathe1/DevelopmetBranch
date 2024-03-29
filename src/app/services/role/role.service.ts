import { Injectable } from "@angular/core";
import { CoreDataService } from "../core-data.service";
import { HttpClient } from "@angular/common/http";
import { Cookie } from "../cookie.service";
import { AppInsightsService } from "../app-insights.service";
import { environment } from "../../../environments/environment";
import { Controllers } from "../../views/shared/controller";
import { BaseResponse } from "../../models/core/baseResponse.model";
import { roleAddUpdateRequest } from "../../models/request/role/roleAddUpdate.model";
import { Observable } from "rxjs";
import { Action } from "../../views/shared/action";
import { RoleNameListModel } from "../../models/core/rolename.model";
import { RoleModel } from "../../models/response/role/role.model";
import { rolelist } from '../../models/response/role/rolelist.model';
import { rolelistrequest } from "../../models/request/role/rolelistrequest.model";


@Injectable({
    providedIn: 'root',
})
export class RoleService extends CoreDataService {
    constructor(httpClient: HttpClient, cookie: Cookie, appInsightsService: AppInsightsService) {
        super(httpClient, environment.ApiUrl, Controllers.Role, cookie, appInsightsService);
    }

    addRole(model: roleAddUpdateRequest) {
        return this.post<roleAddUpdateRequest, BaseResponse<Int16Array>>(model, '');
    }

    GetRoleList(): Observable<BaseResponse<Array<RoleNameListModel>>> {
        return this.get<Array<RoleNameListModel>>('', Action.rolelist);
    }    

    GetRoleTotal(model:rolelistrequest): Observable<BaseResponse<rolelist>> {
        return this.post<rolelistrequest,rolelist>(model, Action.list);
    }

    getRoleById(id: number): Observable<BaseResponse<RoleModel>> {
        return this.get<RoleModel>(id, '');
    }
    DeleteRole(RoleId: number): Observable<BaseResponse<Int16Array>> {
        return this.delete<Int16Array>(RoleId, '');
    }

    updateRole(id: number, model: roleAddUpdateRequest) {
        return this.put<roleAddUpdateRequest>(id, '', model);
    }



}
