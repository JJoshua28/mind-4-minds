import {Component, inject, input, OnInit, signal, Signal, WritableSignal} from '@angular/core';
import {MentorComponent} from "../../components/mentor/mentor.component";
import {SidebarNavigationComponent} from "../../components/sidebar-navigation/sidebar-navigation.component";
import {UserRepository} from "../../../../shared/repositories/user.repository";
import {UserDetails} from "../../../../types/user.interface";
import {take} from "rxjs";
import {MenteeComponent} from "../../components/mentee/mentee.component";

@Component({
  selector: 'app-mentee-page',
  standalone: true,
  imports: [
    MentorComponent,
    SidebarNavigationComponent,
    MenteeComponent
  ],
  templateUrl: './mentee-details-page.component.html',
  styleUrl: './mentee-details-page.component.scss'
})
export class MenteeDetailsPageComponent implements OnInit {
  private readonly _userRepository = inject(UserRepository)

  userDetailsId = input.required<string>()
  $userDetails!: WritableSignal<UserDetails>


  ngOnInit(): void {
    this._userRepository.getUserDetailsById(this.userDetailsId()).pipe(
      take(1),
    ).subscribe((userDetails) => {
      this.$userDetails = signal(userDetails);
    })
  }

  requestDetails() {
    this._userRepository.getUserDetailsById(this.userDetailsId()).pipe(
      take(1),
    ).subscribe((userDetails) => {
      this.$userDetails.set(userDetails);
    })
  }
}
