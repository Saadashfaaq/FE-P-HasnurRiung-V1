import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormLeaveService {
  constructor(private _apollo: Apollo) {}

  CreateFormLeave(payload) {
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
              pdf_application_form
              pdf_leave_letter
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

  UpdateFormIdentity(payload, id) {
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
              current_step_index
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

  GetOneApplicationForm(payload) {
    return this._apollo
      .query({
        query: gql`
          query GetOneApplicationForm($_id: ID) {
            GetOneApplicationForm(_id: $_id) {
              travel_tickets {
                name
                is_additional_family
                departure_to
                departure_from
                arrival_to
                arrival_from
                age
              }
              status
              phone_number
              permission_category
              pending_job
              pdf_work_letter
              pdf_leave_letter
              pdf_application_form
              leaves {
                travel_date
                permission_type
                permission_start_date
                permission_end_date
                permission_duration
                leave_comment
                leave_category
                is_permission
                is_field_leave
                is_compensation
                is_yearly_leave
                field_leave_start_date
                field_leave_end_date
                field_leave_duration
                departure_off_day {
                  date
                  time
                }
                compensation_start_date
                compensation_end_date
                compensation_duration
                yearly_leave_start_date
                yearly_leave_end_date
                yearly_leave_duration
              }
              leave_location
              leave_address
              is_with_family
              is_ticket_supported
              form_status
              employee_id {
                status
                remaining_yearly_leaves
                position {
                  status
                  position
                  name
                  department
                  count_document
                  _id
                }
                poh_status
                poh_location
                placement_status
                name
                age
                lump_sump_amount
                is_routine_official_letter
                is_lump_sump
                is_eligible_for_leave
                family_status
                employee_number
                date_of_registration {
                  date
                  time
                }
                date_of_eligible_for_leave {
                  date
                  time
                }
                date_of_birth
                count_document
                _id
              }
              current_step_index
              created_location
              created_date
              count_document
              approval {
                approver_id {
                  name
                  _id
                }
              }
              application_type
              form_status
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
              total_leaves
              start_date
              end_date
              current_approval_index
              _id
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

  GetOneEmployee(payload) {
    return this._apollo
      .query({
        query: gql`
          query GetOneEmployee($id: ID!) {
            GetOneEmployee(_id: $id) {
              name
              age
              remaining_yearly_leaves
              employee_number
              family_status
              date_of_registration {
                time
                date
              }
              poh_status
              poh_location
              position {
                name
              }
              placement_status
              is_routine_official_letter
              is_lump_sump
              lump_sump_amount
              date_of_eligible_for_leave {
                time
                date
              }
              _id
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

  GetAllEmployees() {
    return this._apollo
      .query({
        query: gql`
          query GetAllEmployees {
            GetAllEmployees {
              name
              _id
              employee_number
            }
          }
        `,
        fetchPolicy: 'network-only',
      })
      .pipe(map((resp) => resp.data['GetAllEmployees']));
  }

  GetAllApprovalGroups(userId?) {
    return this._apollo
      .query({
        query: gql`
          query GetAllApprovalGroups($filter: ApprovalGroupFilter) {
            GetAllApprovalGroups(filter: $filter) {
              _id
              name
              approval_index
              approvals {
                default_approver {
                  name
                  _id
                  employee_number
                }
              }
            }
          }
        `,
        variables: {
          filter: {
            is_enabled: true,
            employee_id: userId ? userId : null,
            is_for_form: true
          },
        },
        fetchPolicy: 'network-only',
      })
      .pipe(map((resp) => resp.data['GetAllApprovalGroups']));
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
              }
              is_ticket_supported
              start_date
              end_date
              created_date
              form_status
              pdf_application_form
              pdf_leave_letter
              count_document
              employee_id {
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

  GetAllApproalGroupMenu(userId) {
    return this._apollo
      .query({
        query: gql`
          query GetAllApprovalGroups($filter: ApprovalGroupFilter) {
            GetAllApprovalGroups(filter: $filter) {
              _id
              name
              approval_index
              department
              approvals {
                approver_list {
                  name
                  employee_number
                  position {
                    name
                  }
                }
              }
            }
          }
        `,
        variables: {
          filter: {
            employee_id: userId,
          },
        },
        fetchPolicy: 'network-only',
      })
      .pipe(map((resp) => resp.data['GetAllApprovalGroups']));
  }

  GetOneApproalGroupMenu(id, employee_id, department) {
    return this._apollo
      .query({
        query: gql`
          query GetOneApprovalGroup($_id: ID, $filter: ApprovalGroupFilter) {
            GetOneApprovalGroup(_id: $_id, filter: $filter) {
              _id
              name
              approval_index
              department
              approvals {
                approver_list {
                  name
                  _id
                  employee_number
                }
              }
            }
          }
        `,
        variables: {
          _id: id,
          filter: {
            employee_id: employee_id,
            department: department,
          },
        },
        fetchPolicy: 'network-only',
      })
      .pipe(map((resp) => resp.data['GetOneApprovalGroup']));
  }

  GetAllEmployeesApprovalMenu(department) {
    return this._apollo
      .query({
        query: gql`
          query GetAllEmployees($filter: EmployeeFilter) {
            GetAllEmployees(filter: $filter) {
              _id
              name
              employee_number
            }
          }
        `,
        variables: {
          filter: {
            department: department,
          },
        },
        fetchPolicy: 'network-only',
      })
      .pipe(map((resp) => resp.data['GetAllEmployees']));
  }

  UpdateApprovalGroup(payload) {
    return this._apollo
      .mutate({
        mutation: gql`
          mutation UpdateApprovalGroup(
            $_id: ID
            $approval_group_input: ApprovalGroupInput
          ) {
            UpdateApprovalGroup(
              _id: $_id
              approval_group_input: $approval_group_input
            ) {
              _id
            }
          }
        `,
        variables: {
          _id: payload.id,
          approval_group_input: payload.approvalGroupInput,
        },
        errorPolicy: 'all',
      })
      .pipe(map((resp) => resp?.data['UpdateApprovalGroup']));
  }

  GetAllNotifications(userId) {
    return this._apollo
      .query({
        query: gql`
          query GetAllNotifications($filter: NotificationFilter) {
            GetAllNotifications(filter: $filter) {
              _id
              letter_type
              application_form_id {
                _id
                employee_id {
                  _id
                  name
                }
              }
              from {
                name
              }
              is_read
              text
            }
          }
        `,
        variables: {
          filter: {
            // approver_id: userId,
            to: userId
          },
        },
        fetchPolicy: 'network-only',
      })
      .pipe(map((resp) => resp.data['GetAllNotifications']));
  }

  UpdateNotification(id, is_read) {
    return this._apollo
      .mutate({
        mutation: gql`
          mutation UpdateNotification(
            $_id: ID
            $notification_input: NotificationInput
          ) {
            UpdateNotification(
              _id: $_id
              notification_input: $notification_input
            ) {
              _id
              application_form_id {
                _id
                employee_id {
                  name
                }
                _id
              }
              is_read
            }
          }
        `,
        variables: {
          _id: id,
          notification_input: {
            is_read: is_read,
          },
        },
        errorPolicy: 'all',
      })
      .pipe(map((resp) => resp?.data['UpdateNotification']));
  }


  getOneFormUserBarcode(payload) {
    return this._apollo
      .query({
        query: gql`
          query GetOneApplicationForm($_id: ID) {
            GetOneApplicationForm(_id: $_id) {
              employee_id {
                name
                employee_number
              }
              created_date
              date_of_approval
              approval {
                date_of_approval {
                  date
                  time
                }
                approver_id {
                  name
                  position {
                    name
                  }
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
