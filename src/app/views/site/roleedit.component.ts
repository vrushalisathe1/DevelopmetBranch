import { Component, OnInit, ViewChild } from '@angular/core';
import { SystemService } from '../../services/system.service';
import { MenusItem } from '../../models/core/menu.model';
import { MenuItem, MessageService, TreeDragDropService, TreeNode } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { roleAddUpdateRequest } from '../../models/request/role/roleAddUpdate.model';
import { RoleService } from '../../services/role/role.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { NodeService } from '../../services/role/nodeservice';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-roleedit',
    standalone: true,
    imports: [CommonModule, RouterModule, SharedModule],
    providers: [TreeDragDropService],
    templateUrl: './roleedit.component.html'
})
export class RoleEditComponent implements OnInit {
    files1: TreeNode[];
    files2: TreeNode[];
    public roleForm: FormGroup;
    public customMenuForm: FormGroup;
    public paramId: number = 0;
    public isSubmitted: boolean = false;
    public isSubmittedRole: boolean = false;
    public displayRoleMenuPopup: boolean = false;
    public resetForm: roleAddUpdateRequest;
    @ViewChild('Title') input;
    menuItems: MenusItem[] = [];
    items: MenuItem[];
    selectedFile: TreeNode;
    isEdit: boolean = false;
    public subscriptions = new Subscription();
    constructor(private fb: FormBuilder, private router: Router, private roleService: RoleService, private systemService: SystemService,
        private nodeService: NodeService, private activatedroute: ActivatedRoute, private messageService: MessageService) { }

    ngOnInit(): void {
        this.paramId = +this.activatedroute.snapshot.paramMap.get('id');
        this.systemService.getMenuItem().then(d => {
            this.menuItems = d;
        });
        this.files2 = [];
        this.nodeService.getFiles().then(files => this.files1 = files.sort((a, b) => a.label.localeCompare(b.label)));
        this.setFormBuilder();
        this.getRoleById();
        this.items = [
            { label: 'Edit', icon: 'pi pi-file-edit', command: (event) => this.EditNode(this.selectedFile) },
            { label: 'Delete', icon: 'pi pi-times', command: (event) => this.DeleteNode(this.selectedFile) }
        ];
    }

    EditNode(file: TreeNode) {
        this.displayRoleMenuPopup = true;
        this.isEdit = true;
        this.input.nativeElement.value = file.label;
    }

    DeleteNode(file: TreeNode) {
        this.removeMenuItemByKey(this.files2, file.key);
    }

    removeMenuItemByKey(menuItems: TreeNode[], keyToRemove: string): void {
        menuItems.forEach((item, index) => {
            if (item.key === keyToRemove) {
                menuItems.splice(index, 1);
                return;
            }

            if (item.children)
                this.removeMenuItemByKey(item.children, keyToRemove);
        });
    }

    setFormBuilder() {
        this.roleForm = this.fb.group({
            roleID: [0],
            name: ["", [Validators.required]],
            isActive: [false],

        });
    }

    getRoleById() {
        this.subscriptions.add(this.roleService.getRoleById(this.paramId).subscribe(d => {
            this.roleForm.setValue({
                roleID: d.data.RoleID,
                name: d.data.Name,
                isActive: d.data.IsActive
            })
            this.files2 = JSON.parse(d.data.Content);
            this.resetForm = this.roleForm.getRawValue();
        }))
    }

    roleUpdate() {
        this.isSubmitted = true;
        if (this.roleForm.invalid || this.files2.length == 0) {
            return;
        }
        else {
            let obj: any = {};
            obj = this.roleForm.getRawValue();
            this.removeTreeParent(this.files2)
            obj.content = JSON.stringify(this.files2);
            this.roleService.updateRole(this.paramId, obj).subscribe(
                (response) => {
                    if (response.data) {
                        this.messageService.add({ severity: 'success', summary: 'Updated Successfully!!!', detail: 'Data Updated Succesfully', life: 3000 });
                        this.router.navigate(['/role']);
                        this.roleForm.reset();
                    }
                }
            );
        }
    }

    addTreeNode(title: string) {
        this.isSubmittedRole = true;
        if (title && !this.isEdit && !this.files2.some(x => x.label == title)) {
            this.files2.push({ label: title, data: title + " Folder", icon: "pi pi-folder", key: (Math.floor(Math.random() * 10000) + 1).toString() });
            this.displayRoleMenuPopup = false;
            this.isSubmittedRole = false;
            this.input.nativeElement.value = "";
        } else if (title && this.isEdit) {
            this.selectedFile.label = title;
            this.isEdit = false;
            this.selectedFile = null;
            this.displayRoleMenuPopup = false;
            this.isSubmittedRole = false;
            this.input.nativeElement.value = "";
        }
    }

    removeTreeParent: any = (obj: any) => {
        obj.forEach((item: any, index: number) => {
            item.parent = null;
            try {
                this.removeTreeParent(item.children);
            }
            catch { }
        });
    }

    cancelMenuPopup() {
        this.displayRoleMenuPopup = false;
        this.isSubmittedRole = false;
        this.input.nativeElement.value = "";
    }

    resetRoleForm() {
        this.roleForm.patchValue(this.resetForm);
        this.ngOnInit();
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

}

