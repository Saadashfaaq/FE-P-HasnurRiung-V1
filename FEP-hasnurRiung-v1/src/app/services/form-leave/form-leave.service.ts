import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormLeaveService {

  constructor(
    private _apollo: Apollo,
  ) {}

  CreateFormIdentity(payload) {
    return this._apollo
      .mutate({
        mutation: gql`
          mutation CreateApplicationForm(
            $application_form_input: ApplicationFormInput
          ) {
            CreateApplicationForm(
              application_form_input: $application_form_input
            ){
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

  UpdateFormIdentity(payload, id) {
    return this._apollo
      .mutate({
        mutation: gql`
          mutation UpdateApplicationForm(
            $application_form_input: ApplicationFormInput,
            $_id : ID
          ) {
            UpdateApplicationForm(
              application_form_input: $application_form_input,
              _id: $_id
            ){
              _id
              current_step_index
            }
          }
        `,
        variables: {
          application_form_input: payload,
          _id: id
        },
        errorPolicy: 'all',
      })
      .pipe(map((resp) => resp?.data['UpdateApplicationForm']));
  }


  GetOneApplicationForm(payload){
    return this._apollo
    .query({
      query: gql`
        query GetOneApplicationForm(
          $_id: ID
        ) {
          GetOneApplicationForm(
            _id: $_id
          ) {
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
            pdf_work_permit
            pdf_leave_permit
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
              }
            }
            application_type
            _id
          }
        }
      `,
      variables: {
        _id: payload
      },
      fetchPolicy: 'network-only',
    })
    .pipe(map((resp) => resp.data['GetOneApplicationForm']));
  }
  

  GetOneEmployee(payload) {
    return this._apollo.query({
      query: gql`
        query GetOneEmployee($id: ID!) {
          GetOneEmployee(_id: $id) {
            name
            employee_number
            family_status
            date_of_registration {
              time
              date
            }
            poh_status
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
        id: "66181cac2d03e3e3187fa584"
      },
      fetchPolicy: 'network-only',
    }).pipe(map(resp => resp.data['GetOneEmployee']));
  }

  GetAllEmployees() {
    return this._apollo.query({
      query: gql`
        query GetAllEmployees {
          GetAllEmployees {
            name
            _id
          }
        }
      `,
      fetchPolicy: 'network-only',
    }).pipe(map(resp => resp.data['GetAllEmployees']));
  }

  GetAllApprovalGroups() {
    return this._apollo.query({
      query: gql`
        query GetAllApprovalGroups($filter: ApprovalGroupFilter) {
          GetAllApprovalGroups(filter: $filter)  {
            _id
            name
            approval_index
          }
        }
      `,
      variables: {
        filter: {
          is_enabled: true
        }
      },
      fetchPolicy: 'network-only',
    }).pipe(map(resp => resp.data['GetAllApprovalGroups']));
  }
}
