import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private _apollo: Apollo,
  ) { }

  Login(employeeNumber, password) {
    return this._apollo
      .mutate({
        mutation: gql`
          mutation Login($employeeNumber: String, $password: String) {
            Login(employee_number: $employeeNumber, password: $password) {
              token
              employee {
                profile_picture
                date_of_eligible_for_leave {
                  date
                }
                _id
                name
                is_admin
                employee_number
                position {
                  department
                  name
                }
              }
            }
          }
        `,
        variables: {
          employeeNumber: employeeNumber,
          password: password,
        },
        errorPolicy: 'all',
      })
      .pipe(map((resp) => resp?.data['Login'])); // Memetakan respons ke hasil login
  }


  UpdateEmployee(payload, id) {
    return this._apollo
      .mutate({
        mutation: gql`
          mutation UploadFile($file: Upload!, $employee_id: ID) {
            UploadFile(file: $file, employee_id: $employee_id) {
              profile_picture
            }
          }
        `,
        variables: {
          file: payload,
          employee_id: id,
        },
        errorPolicy: 'all',
      })
      .pipe(map((resp) => resp?.data['UploadFile']))
  }


}
