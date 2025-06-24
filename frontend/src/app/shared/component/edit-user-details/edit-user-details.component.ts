import {
  Component,
  ElementRef,
  input,

  OnInit,
  signal,
  ViewChild,
  WritableSignal
} from '@angular/core';
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
  @ViewChild("profilePic") profilePic!: ElementRef;

  $changeType = input.required<EditType>()
  $shouldDisplayCurrentPassword!: WritableSignal<boolean>;
  $currentProfilePic = input.required<string>()

  filePreviewUrl!: WritableSignal<string>;

  $userDetailsForm = input.required<FormGroup<UserFormControls>>();

  ngOnInit() {
    this.$shouldDisplayCurrentPassword = signal(this.$changeType() === "edit")
    this.filePreviewUrl = signal(this.$currentProfilePic())
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
