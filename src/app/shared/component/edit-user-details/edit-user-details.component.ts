import {Component, input, OnInit, signal, WritableSignal} from '@angular/core';
import {TextInputComponent} from "../text-input/text-input.component";
import {DateInputComponent} from "../date-input/date-input.component";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import {UserFormControls} from "../../../types/user details/user-form.interface";

const editType = {
  EDIT: 'edit',
  REGISTER: 'register'
} as const;

type EditType = typeof editType[keyof typeof editType];

@Component({
  selector: 'app-edit-user-details',
  standalone: true,
  imports: [
    TextInputComponent,
    DateInputComponent,
    ReactiveFormsModule
  ],
  templateUrl: './edit-user-details.component.html',
  styleUrl: './edit-user-details.component.scss'
})
export class EditUserDetailsComponent implements OnInit {

  $changeType = input.required<EditType>()
  $shouldDisplayCurrentPassword!: WritableSignal<boolean>;

  defaultProfilePic = "https://upload.wikimedia.org/wikipedia/commons/b/b5/Windows_10_Default_Profile_Picture.svg"
  filePreviewUrl!: WritableSignal<string> ;

  $userDetailsForm = input.required<FormGroup<UserFormControls>>();

  ngOnInit() {
    this.$shouldDisplayCurrentPassword = signal(this.$changeType() === "edit")

    const {profilePic } = this.$userDetailsForm().value;
    const previewImage = profilePic?
      URL.createObjectURL(profilePic) : this.defaultProfilePic

    this.filePreviewUrl = signal(previewImage);

  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];

      this.filePreviewUrl.set(URL.createObjectURL(file));

      this.$userDetailsForm().patchValue({ profilePic: file });
    }
  }

}
