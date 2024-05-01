import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormLeaveService } from 'src/app/services/form-leave/form-leave.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-approval-group-dialog',
  standalone: true,
  imports: [
    SharedModule,
    MatButtonModule
  ],
  templateUrl: './approval-group-dialog.component.html',
  styleUrl: './approval-group-dialog.component.scss'
})
export class ApprovalGroupDialogComponent {
  subs: SubSink = new SubSink();
  summary = new UntypedFormControl('', [Validators.required])
  formApproval2: FormGroup;
  formApproval3: FormGroup;
  employeeList
  employeeId
  openApproval3 : boolean = false

  constructor(
    public dialogRef: MatDialogRef<ApprovalGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formLeaveService : FormLeaveService,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ){}

  onSubmit(){}

  OnClose(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.employeeId = localStorage.getItem('userProfile');
    this.GetAllEmployee()
    this.GetOneApproalGroupMenu()
    this.InitFormApproval2()
    
    const approvalCount = 5;
  
    // Buat approval2 beberapa kali sesuai kebutuhan
    for (let i = 0; i < approvalCount; i++) {
      this.CreateApprovals2();
    }
  }

  InitFormApproval2(){
    this.formApproval2 = this.formBuilder.group({
      employees: this.formBuilder.array([]), 
    });
  }
  InitFormApproval3(){
    this.formApproval3 = this.formBuilder.group({
      employees: this.formBuilder.array([]), 
    });
  }

      // Getter for the addresses FormArray
      get approvals2(): FormArray {
        return this.formApproval2.get('employees') as FormArray;
      }  
      // Helper method untuk mengisi FormArray addresses dengan data yang ada
    updateApprovals2(approvalsData: any[]): void {
      const approvalsArray = this.formApproval2.get('employees') as FormArray;
      approvalsData.forEach((approvals) => {
        approvalsArray.push(this.CreateApprovals2());
      });
    }    
  
  // Helper method untuk membuat FormGroup alamat dengan data awal
      CreateApprovals2() {
        const newEmployee = this.formBuilder.group({
          employee: [ null, Validators.required],
        });

        this.approvals2.push(newEmployee)
      }
    
      // Remove an address from the FormArray
      RemoveApproval2(index: number): void {
        this.approvals2.removeAt(index);
      }



      // Getter for the addresses FormArray
      get approvals3(): FormArray {
        return this.formApproval3.get('employees') as FormArray;
      }  
      // Helper method untuk mengisi FormArray addresses dengan data yang ada
    updateApprovals3(approvalsData: any[]): void {
      const approvalsArray = this.formApproval3.get('employees') as FormArray;
      approvalsData.forEach((approvals) => {
        approvalsArray.push(this.CreateApprovals3());
      });
    }    
  
  // Helper method untuk membuat FormGroup alamat dengan data awal
      CreateApprovals3() {
        const newEmployee = this.formBuilder.group({
          employee: [ null, Validators.required],
        });

        this.approvals3.push(newEmployee)
      }
    
      // Remove an address from the FormArray
      RemoveApproval3(index: number): void {
        this.approvals3.removeAt(index);
      }



      GetOneApproalGroupMenu(){
        this.subs.sink = this._formLeaveService.GetOneApproalGroupMenu(this.data._id, this.employeeId)
         .subscribe(
          (resp)=>{
            if(resp){
              if(resp.approvals.length > 1){
                this.openApproval3 = true
                this.InitFormApproval3()
                this.changeDetectorRef.detectChanges();
                const approvalCount = 5;
              
                // Buat approval2 beberapa kali sesuai kebutuhan
                for (let i = 0; i < approvalCount; i++) {
                  this.CreateApprovals3()
                }
                // const toSelect2 = this.employeeList.find(c => c._id === resp.approvals[0].approver_list[0]._id);
                
                // this.approvals2.at(0).get('employee').setValue(resp.approvals[0].approver_list[0]._id)
                resp.approvals[0].approver_list.forEach((list,index)=>{
                  this.approvals2.at(index).get('employee').setValue(list._id)
                })
                // const toSelect3 = this.employeeList.find(c => c._id === resp.approvals[1].approver_list[0]._id);
                
                // this.approvals3.at(0).get('employee').setValue(resp.approvals[1].approver_list[0]._id)
                resp.approvals[1].approver_list.forEach((list,index)=>{
                  this.approvals3.at(index).get('employee').setValue(list._id)
                })
              } else {
                resp.approvals[0].approver_list.forEach((list,index)=>{
                  this.approvals2.at(index).get('employee').setValue(list._id)
                })
              }
            }
          },
          (err)=>{
            console.error(err)
          }
        )
      }

      GetAllEmployee(){
        
        this.subs.sink = this._formLeaveService.GetAllEmployeesApprovalMenu(this.employeeId)
        .subscribe(
         (resp)=>{
           if(resp){
             this.employeeList = resp
           }
         },
         (err)=>{
           console.error(err)
         }
       )
      }


    UpdateGroupMutation(){
     const approvalFormArray = [
      this.formApproval2.value, 
      this.formApproval3 ? this.formApproval3.value : []
    ]

      const payload = this.CreateDynamicPayload(this.data._id, approvalFormArray)


      this.subs.sink = this._formLeaveService.UpdateApprovalGroup(payload)
      .subscribe((reps)=>{
        if(reps){
          this.dialogRef.close('success');
        }
      })
    }

    CreateDynamicPayload(id, approvalForms) {
      // Filter approvalForms untuk menghindari elemen yang kosong atau tidak valid
      const validApprovalForms = approvalForms.filter((form) => form && form.employees && form.employees.length > 0);
    
      // Pemetaan hanya pada formulir yang valid
      const approvals = validApprovalForms.map((form, index) => {
        const approverList = form.employees.map((emp) => emp.employee); 
    
        return {
          approval_index: index + 1, // Indeks persetujuan berdasarkan urutan dalam array
          default_approver: approverList[0], // Default approver adalah yang pertama dalam daftar
          approver_list: approverList, // Daftar semua approver dalam grup ini
        };
      });
    
      const payload = {
        id: id, // ID utama, dapat disesuaikan
        approvalGroupInput: {
          approvals: approvals, // Tambahkan daftar persetujuan yang telah diolah
        },
      };
    
      return payload; // Kembalikan payload yang telah dibuat
    }



}
