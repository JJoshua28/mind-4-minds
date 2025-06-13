import { Component } from '@angular/core';
import {NavigationBarComponent} from "../../../shared/component/navigation-bar/navigation-bar.component";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-main-layout',
  standalone: true,
    imports: [
        NavigationBarComponent,
        RouterOutlet
    ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {

}
