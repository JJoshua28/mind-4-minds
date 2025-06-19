import { ComponentFixture, TestBed } from '@angular/core/testing';

import {NavigationItems, SidebarNavigationComponent} from './sidebar-navigation.component';
import {Router} from "@angular/router";
import {MyMenteesPageComponent} from "../../../my-mentees/page/my-mentees-page/my-mentees-page.component";
import {RouterTestingModule} from "@angular/router/testing";
import {UserDetailsComponent} from "../user-details/user-details.component";
import {MenteeDetailsPageComponent} from "../../page/mentee-details/mentee-details-page.component";

describe('SidebarNavigationComponent', () => {
  let component: SidebarNavigationComponent;
  let fixture: ComponentFixture<SidebarNavigationComponent>;
  let router: Router;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SidebarNavigationComponent,
        MyMenteesPageComponent,
        RouterTestingModule.withRoutes([
          {path: "user-details", component: UserDetailsComponent},
          {path: "mentee-details", component: MenteeDetailsPageComponent},
          {path: "mentor-details", component: MenteeDetailsPageComponent}
        ])
      ]
    })
    .compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(SidebarNavigationComponent);
    component = fixture.componentInstance;

    await router.navigateByUrl('user-details'); // Set current route
    fixture.detectChanges();
  });

  test.each`
  expectedPage        | url                 | navigationItem
  ${"mentee details"} | ${"mentee-details"} | ${NavigationItems.MENTEE_DETAILS}
  ${"mentor details"} | ${"mentor-details"} | ${NavigationItems.MENTOR_DETAILS}
  `("should navigate to the $expectedPage page", async ({url, navigationItem}:{url: string, navigationItem: NavigationItems})=> {
    component.handleNavigateTo(navigationItem);
    await fixture.whenStable();
    expect(router.url).toBe(`/${url}`);
  })

});
