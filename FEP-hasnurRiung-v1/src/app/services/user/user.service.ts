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
                _id
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
}
