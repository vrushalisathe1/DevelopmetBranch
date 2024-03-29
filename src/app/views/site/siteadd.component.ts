import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem, MessageService, TreeDragDropService, TreeNode } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RoleService } from '../../services/role/role.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { NodeService } from '../../services/role/nodeservice';
import { KeyValue } from '../../models/core/keyvalue.model';
 
 
@Component({
    selector: 'app-siteadd',
    standalone: true,
    imports: [CommonModule, RouterModule, SharedModule],
    providers: [TreeDragDropService],
    templateUrl: './siteadd.component.html'
})
export class SiteAddComponent implements OnInit {
    files1: TreeNode[];
    files2: TreeNode[];
    files2Json: string;
    public subscriptions = new Subscription();
    public roleForm: FormGroup;
    public isSubmitted: boolean = false;
    public isSubmittedRole: boolean = false;
    public displayRoleMenuPopup: boolean = false;
    @ViewChild('Title') input;
    items: MenuItem[];
    selectedFile: TreeNode;
    isEdit: boolean = false;
    public customer: Array<KeyValue> = [];
   
    constructor(private fb: FormBuilder, private router: Router, private roleService: RoleService,
        private nodeService: NodeService, private messageService: MessageService) { }
 
    ngOnInit(): void {
        this.files2 = [];
        this.nodeService.getFiles().then(files => this.files1 = files.sort((a, b) => a.label.localeCompare(b.label)));
        this.setFormBuilder();
        this.items = [
            { label: 'Edit', icon: 'pi pi-file-edit', command: (event) => this.EditNode(this.selectedFile) },
            { label: 'Delete', icon: 'pi pi-times', command: (event) => this.DeleteNode(this.selectedFile) }
        ];
        this.customer = [
            { name: "Welcome, NC", value: 1 },
            { name: "Dallas, Texas", value: 2 }
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
            isActive: [false]
        });
    }
 
    roleSave() {
        this.isSubmitted = true;
        if (this.roleForm.invalid || this.files2.length == 0) {
            return;
        }
        else {
            let obj: any = {};
            obj = this.roleForm.getRawValue();
            this.removeTreeParent(this.files2)
            obj.content = JSON.stringify(this.files2);
            this.subscriptions.add(this.roleService.addRole(obj).subscribe(
                (response) => {
                    if (response.data) {
                        this.messageService.add({ severity: 'success', summary: 'Saved Successfully!!!', detail: 'Data Saved Succesfully' });
                        this.router.navigate(['/role']);
                        this.roleForm.reset();
                    }
                }
            ));
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
        this.roleForm.reset({ roleID: 0 });
        this.ngOnInit();
    }
 
    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
 
 