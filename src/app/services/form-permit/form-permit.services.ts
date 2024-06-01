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


  GetAllApplicationFormsEmployee(filter, sorting, pagination?) {
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
                name
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

  GetAllApplicationForms(filter, sorting, pagination?) {
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
                employee_number
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

  DeleteApplicationForm(
    filter,
    pagination,
    isSelectAll,
    formIds,
    unselectFormIds
  ) {
    return this._apollo
      .mutate({
        mutation: gql`
          mutation DeleteApplicationForm(
            $formIds: [ID]
            $isSelectAll: Boolean
            $unselectFormIds: [ID]
            $filter: ApplicationFormFilter
            $pagination: PaginationInput
          ) {
            DeleteApplicationForm(
              form_ids: $formIds
              is_select_all: $isSelectAll
              unselect_form_ids: $unselectFormIds
              filter: $filter
              pagination: $pagination
            ) {
              leave_letter_number
              employee_id {
                _id
                employee_number
                name
                position {
                  name
                  department
                }
                poh_status
                lump_sump_amount
                remaining_yearly_leaves
              }
              application_type
              leaves {
                departure_off_day {
                  date
                }
                travel_date
                field_leave_duration
                yearly_leave_duration
                permission_duration
                compensation_duration
                leave_comment
              }
              leave_letter_month
              leave_letter_year
              travel_duration
              work_start_date
              start_date
              end_date
              leave_location
              created_date
              form_status
              pdf_application_form
              pdf_leave_letter
              count_document
              total_leaves
              is_ticket_supported
              _id
            }
          }
        `,
        variables: {
          filter,
          pagination,
          formIds,
          isSelectAll,
          unselectFormIds,
        },
        errorPolicy: 'all',
      })
      .pipe(map((resp) => resp?.data['DeleteApplicationForm']));
  }

  ExportAppllicationForm(letterType) {
    return this._apollo
      .mutate({
        mutation: gql`
          mutation ExportAppllicationForm(
            $letterType: LetterTypeEnum) {
            ExportAppllicationForm(
              letter_type: $letterType
          }
        `,
        variables: {
          letterType,
        },
        errorPolicy: 'all',
      })
  }

  ExportEmployeeAsTemplate() {
    return this._apollo
      .mutate({
        mutation: gql`
        mutation Mutation {
          ExportEmployeeAsTemplate
        }
        `,
        errorPolicy: 'all',
      })
  }

  GetAllApplicationFormsSelection(filter, sorting, pagination) {
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
