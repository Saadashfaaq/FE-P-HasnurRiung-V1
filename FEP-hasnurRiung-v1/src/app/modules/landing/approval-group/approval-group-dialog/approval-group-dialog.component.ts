import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormLeaveService } from 'src/app/services/form-leave/form-leave.service';
import { SubSink } from 'subsink';
import {MatDividerModule} from '@angular/material/divider';
import { NgSelectModule } from '@ng-select/ng-select';
import Swal from 'sweetalert2';
import { result } from 'lodash';

@Component({
  selector: 'app-approval-group-dialog',
  standalone: true,
  imports: [
    SharedModule,
    MatButtonModule,
    MatDividerModule,
    NgSelectModule,
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
  originalEmployeeList
  hcgsList
  originalHcgsList
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
        this.subs.sink = this._formLeaveService.GetOneApproalGroupMenu(this.data._id, this.employeeId, this.data.department)
         .subscribe(
          (resp)=>{
            if(resp){
              if(resp.approvals.length > 1){
                this.openApproval3 = true
                this.GetAllEmployee3()
                this.InitFormApproval3()
                this.changeDetectorRef.detectChanges();

                const approvalCount2 = resp.approvals[0].approver_list.length <= 5 ? 5 : resp.approvals[0].approver_list.length;
  
                // Buat approval2 beberapa kali sesuai kebutuhan
                for (let i = 0; i < approvalCount2; i++) {
                  this.CreateApprovals2();
                }

                const approvalCount3 = resp.approvals[1].approver_list.length <= 5 ? 5 : resp.approvals[1].approver_list.length;
                for (let i = 0; i < approvalCount3; i++) {
                  this.CreateApprovals3()
                }
                resp.approvals[0].approver_list.forEach((list,index)=>{
                  this.approvals2.at(index).get('employee').setValue(list._id)
                  this.changeDetectorRef.detectChanges()
                })
                resp.approvals[1].approver_list.forEach((list,index)=>{
                  this.approvals3.at(index).get('employee').setValue(list._id)
                  this.changeDetectorRef.detectChanges()
                })
                
              } else {
                resp.approvals[0].approver_list.forEach((list,index)=>{
                  this.approvals2.at(index).get('employee').setValue(list._id)
                  this.changeDetectorRef.detectChanges()
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
        this.subs.sink = this._formLeaveService.GetAllEmployeesApprovalMenu(this.data.department)
        .subscribe(
         (resp)=>{
          if(resp){
            // Tambahkan properti displayName ke setiap objek
            this.employeeList = resp.map((emp) => ({
              ...emp, // salin semua properti asli
              displayName: `${emp.employee_number} - ${emp.name}`, // tambahkan displayName
            }));
            this.originalEmployeeList = [...this.employeeList]; // simpan salinan asli
         }
         },
         (err)=>{
           console.error(err)
         }
       )
      }
      GetAllEmployee3(){
        this.subs.sink = this._formLeaveService.GetAllEmployeesApprovalMenu('HCGS')
        .subscribe(
         (resp)=>{
          if(resp){
            // Tambahkan properti displayName ke setiap objek
            this.hcgsList = resp.map((emp) => ({
              ...emp, // salin semua properti asli
              displayName: `${emp.employee_number} - ${emp.name}`, // tambahkan displayName
            }));
            this.originalHcgsList = [...this.hcgsList]; // simpan salinan asli
          //  this.employeeList = resp
          //  this.originalEmployeeList = resp
         }
         },
         (err)=>{
           console.error(err)
         }
       )
      }


    UpdateGroupMutation(department){
     const approvalFormArray = [
      this.formApproval2.value, 
      this.formApproval3 ? this.formApproval3.value : []
    ]

      const payload = this.CreateDynamicPayload(this.data._id, approvalFormArray)


      this.subs.sink = this._formLeaveService.UpdateApprovalGroup(payload)
      .subscribe((reps)=>{
        if(reps){
          this.openSwalSave(department)
          // this.dialogRef.close('success');
        }
      })
    }

    CreateDynamicPayload(id, approvalForms) {
      const validApprovalForms = approvalForms.filter((form) => form && form.employees && form.employees.length > 0);
    
      // Pemetaan hanya pada formulir yang valid
      const approvals = validApprovalForms.map((form, index) => {
        const approverList = form.employees.map((emp) => emp.employee); 
    
        return {
          approval_index: index + 1,
          default_approver: approverList[0], 
          approver_list: approverList, 
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

    openSwalSave(department){
      Swal.fire({
        title: `Grup Approval Departemen ${department} berhasil di perbaru`,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        allowEnterKey: false,
        allowEscapeKey: false,
        allowOutsideClick: false,
      }).then((result)=>{
        if(result){
          this.dialogRef.close('success');
        }
      })
    }
    openSwalCancel(){
      Swal.fire({
        title: 'Apakah Anda Yakin Ingin Membatalkan?',
        icon: 'warning',
        html:'Perubahan yang Anda masukkan tidak akan disimpan',
        confirmButtonColor: '#3085d6',
        allowEnterKey: false,
        allowEscapeKey: false,
        allowOutsideClick: false,
        confirmButtonText:'Iya',
        showCancelButton: true,
        cancelButtonText: "Tidak"
      }).then((result)=>{
        if(result.isConfirmed){
          this.dialogRef.close();
        } else {
          return
        }
      })
    }


    onEmployeeSelect() {
      const selectedValues = this.approvals2.controls
        .map((control) => control.get('employee')?.value)
        .filter((value) => value !== null); // kumpulkan semua nilai yang telah dipilih
  
      // Perbarui daftar opsi dengan menghapus item yang telah dipilih
      this.employeeList = this.originalEmployeeList.filter(
        (emp) => !selectedValues.includes(emp._id)
      );
    }
    onHsgsSelect() {
      const selectedValues = this.approvals3.controls
        .map((control) => control.get('employee')?.value)
        .filter((value) => value !== null); // kumpulkan semua nilai yang telah dipilih
  
      // Perbarui daftar opsi dengan menghapus item yang telah dipilih
      this.hcgsList = this.originalHcgsList.filter(
        (emp) => !selectedValues.includes(emp._id)
      );
    }

}
