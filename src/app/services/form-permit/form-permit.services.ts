import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormPermitService {
  constructor(private _apollo: Apollo) {}

  GetOneEmployee(payload) {
    return this._apollo
      .query({
        query: gql`
          query GetOneEmployee($id: ID!) {
            GetOneEmployee(_id: $id) {
              _id
              date_of_eligible_for_leave {
                date
              }
              employee_number
              is_admin
              is_eligible_for_leave
              position {
                position
                name
                department
                type
              }
              name
            }
          }
        `,
        variables: {
          id: payload,
        },
        fetchPolicy: 'network-only',
      })
      .pipe(map((resp) => resp.data['GetOneEmployee']));
  }

  GetAllApprovalGroups() {
    return this._apollo
      .query({
        query: gql`
          query GetApprovalForWorkForm {
            GetApprovalForWorkForm {
              _id
              name
              employee_number
              position {
                position
                name
                department
                type
              }
            }
          }
        `,
        fetchPolicy: 'network-only',
      })
      .pipe(map((resp) => resp.data['GetApprovalForWorkForm']));
  }

  CreateFormPermit(payload) {
    return this._apollo
      .mutate({
        mutation: gql`
          mutation CreateApplicationForm(
            $application_form_input: ApplicationFormInput
          ) {
            CreateApplicationForm(
              application_form_input: $application_form_input
            ) {
              _id
            }
          }
        `,
        variables: {
          application_form_input: payload,
        },
        errorPolicy: 'all',
      })
      .pipe(map((resp) => resp?.data['CreateApplicationForm']));
  }


  GetAllApplicationFormsEmployee(filter, sorting, pagination) {
    return this._apollo
      .query({
        query: gql`
          query GetAllApplicationForms(
            $filter: ApplicationFormFilter
            $sorting: ApplicationFormSorting
            $pagination: PaginationInput
          ) {
            GetAllApplicationForms(
              filter: $filter
              sorting: $sorting
              pagination: $pagination
            ) {
              work_letter_number
              work_letter_month
              work_letter_year
              work_start_date
              work_end_date
              work_duration
              form_status
              pdf_work_letter
              count_document
              employee_id {
                employee_number
                _id
              }
              _id
            }
          }
        `,
        variables: {
          filter,
          sorting,
          pagination,
        },
        fetchPolicy: 'network-only',
      })
      .pipe(map((resp) => resp.data['GetAllApplicationForms']));
  }

  GetOneApplicationForm(payload) {
    return this._apollo
      .query({
        query: gql`
          query GetOneApplicationForm($_id: ID) {
            GetOneApplicationForm(_id: $_id) {
              employee_id {
                _id
                employee_number
                is_admin
                is_eligible_for_leave
                position {
                  position
                  name
                  department
                  type
                }
                name
              }
              date_of_eligible_for_leave
              work_start_date
              work_end_date
              _id
              form_status
              current_approval_index
              approval {
                approval_index
              }
              current_approvers {
                _id
              }
              approval {
                reason_of_approval
                reason_of_rejection
                reason_of_revision
                approval_index
                approver_id {
                  employee_number
                  name
                }
              }
            }
          }
        `,
        variables: {
          _id: payload,
        },
        fetchPolicy: 'network-only',
      })
      .pipe(map((resp) => resp.data['GetOneApplicationForm']));
  }

  UpdateFormPermit(payload, id) {
    return this._apollo
      .mutate({
        mutation: gql`
          mutation UpdateApplicationForm(
            $application_form_input: ApplicationFormInput
            $_id: ID
          ) {
            UpdateApplicationForm(
              application_form_input: $application_form_input
              _id: $_id
            ) {
              _id
            }
          }
        `,
        variables: {
          application_form_input: payload,
          _id: id,
        },
        errorPolicy: 'all',
      })
      .pipe(map((resp) => resp?.data['UpdateApplicationForm']));
  }

  GetAllApplicationForms(filter, sorting, pagination) {
    return this._apollo
      .query({
        query: gql`
          query GetAllApplicationForms(
            $filter: ApplicationFormFilter
            $sorting: ApplicationFormSorting
            $pagination: PaginationInput
          ) {
            GetAllApplicationForms(
              filter: $filter
              sorting: $sorting
              pagination: $pagination
            ) {
              letter_type
              employee_id {
                date_of_eligible_for_leave {
                  date
                }
                family_status
                date_of_registration {
                  date
                }
                _id
                name
                position {
                  type
                  position
                  department
                  name
                }
              }
              work_letter_approval {
                approval_status
              }
              pdf_work_letter
              work_start_date
              work_letter_year
              work_letter_number
              work_letter_month
              work_letter_date_of_approval
              work_letter_date
              work_letter_application_date
              work_end_date
              work_duration
              date_of_eligible_for_leave
              form_status
              count_document
              _id
            }
          }
        `,
        variables: {
          filter,
          sorting,
          pagination,
        },
        fetchPolicy: 'network-only',
      })
      .pipe(map((resp) => resp.data['GetAllApplicationForms']));
  }

  UpdateApprovalApplicationForm(_id, approval_input) {
    return this._apollo
      .mutate({
        mutation: gql`
          mutation UpdateApprovalApplicationForm(
            $_id: ID
            $approval_input: FormApprovalInput
          ) {
            UpdateApprovalApplicationForm(
              _id: $_id
              approval_input: $approval_input
            ) {
              _id
            }
          }
        `,
        variables: {
          _id,
          approval_input,
        },
        errorPolicy: 'all',
      })
      .pipe(map((resp) => resp?.data['UpdateApprovalApplicationForm']));
  }

  GetOneApplicationFormForTimeline(payload) {
    return this._apollo
      .query({
        query: gql`
          query GetOneApplicationForm($_id: ID) {
            GetOneApplicationForm(_id: $_id) {
              current_approval_index
              approval {
                approver_id {
                  name
                  position {
                    name
                    department
                  }
                }
                approval_status
                date_of_approval {
                  date
                  time
                }
                date_of_rejection {
                  date
                  time
                }
                date_of_revision {
                  date
                  time
                }
                reason_of_approval
                reason_of_revision
                reason_of_rejection
              }
            }
          }
        `,
        variables: {
          _id: payload,
        },
        fetchPolicy: 'network-only',
      })
      .pipe(map((resp) => resp.data['GetOneApplicationForm']));
  }

  CheckEmployeeApplicationForm(_id , formType) {
    return this._apollo
      .query({
        query: gql`
          query CheckEmployeeApplicationForm ($employee_id: ID $letter_type: LetterTypeEnum) {
            CheckEmployeeApplicationForm(employee_id: $employee_id  letter_type: $letter_type)
          }
        `,
        variables: {
          employee_id: _id,
          letter_type: formType
        },
        fetchPolicy: 'network-only',
      })
      .pipe(map((resp : any) => resp.data.CheckEmployeeApplicationForm));
  }
}
