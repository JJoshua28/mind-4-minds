import {Component, inject} from '@angular/core';
import {
  AbstractControl, FormArray,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
} from "@angular/forms";
import {TextInputComponent} from "../../../../shared/component/text-input/text-input.component";
import {UserType} from "../../../../types/user-type.enum";
import {TitleCasePipe, UpperCasePipe} from "@angular/common";
import {Router} from "@angular/router";
import {RegistrationService} from "../../registration.service";

interface Role {
  name: UserType;
  description: string;
}

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TextInputComponent,
    UpperCasePipe,
    TitleCasePipe
  ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent {
  private readonly registrationService = inject(RegistrationService)
  private readonly _router = inject(Router);
  private readonly _formBuilder = inject(FormBuilder);

  protected readonly roles: Array<Role> = [
    {
      name: UserType.MENTOR,
      description: "Coach an individual and help them achieve their goals ",
    },
    {
      name: UserType.MENTEE,
      description: "Receive coaching and support and achieve your goals"
    },
    {
      name: UserType.ADMIN,
      description: "System management"
    }
  ]

  rolesControl = this._formBuilder.array(
    this.roles.map( role => this._formBuilder.control(this.registrationService.roles.includes(role.name))), this.atLeastOneCheckedValidator
  )

  roleForm = this._formBuilder.group({
    roles: this.rolesControl,
  })

  atLeastOneCheckedValidator(control: AbstractControl): ValidationErrors | null {
    const formArray = control as FormArray;
    const atLeastOneChecked = formArray.controls.some(ctrl => ctrl.value === true);
    return atLeastOneChecked ? null : { required: true };
  }

  navigateToUserDetails () {
    const userDetailsLink = "profile/user-details/edit";
    this._router.navigate([userDetailsLink]);
  }

  submitRoles () {
    const selectedRoles =  this.roles.filter((roleType, index) => {
      const rolesResults = this.roleForm.value.roles ?? [];
      return rolesResults[index]
    })
    const roleTypes = selectedRoles.map(role => role.name)
    console.log("hmmmmm")

    this.registrationService.addRoles(roleTypes);
    this.navigateToUserDetails()
  }
}
