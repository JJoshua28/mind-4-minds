import {Component, inject, input, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {SidebarNavigationComponent} from "../../components/sidebar-navigation/sidebar-navigation.component";
import {UserDetailsComponent} from "../../components/user-details/user-details.component";
import {MentorComponent} from "../../components/mentor/mentor.component";
import {take} from "rxjs";
import {UserRepository} from "../../../../shared/repositories/user.repository";
import {UserDetails} from "../../../../types/user.interface";
import {Writable} from "node:stream";

@Component({
  selector: 'app-mentor-details-page',
  standalone: true,
  imports: [
    SidebarNavigationComponent,
    MentorComponent
  ],
  templateUrl: './mentor-details-page.component.html',
  styleUrl: './mentor-details-page.component.scss'
})
export class MentorDetailsPageComponent implements OnInit {
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

  refreshDetails() {
    this._userRepository.getUserDetailsById(this.userDetailsId()).pipe(
      take(1),
    ).subscribe((userDetails) => {
      this.$userDetails.set(userDetails);
    })
  }
}
