import {FormControl} from "@angular/forms";

export interface UserFormControls {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  occupation: FormControl<string | null>;
  occupationStartDate: FormControl<string | null>;
  currentPassword: FormControl<string | null>;
  profilePic: FormControl<File | null>;
  email: FormControl<string>;
  newPassword: FormControl<string | null>;
}
