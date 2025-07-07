import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  template: `
    <div class="text-center p-8">
      <h1 class="text-3xl font-bold">404 - Page Not Found</h1>
      <p class="mt-4">Sorry, the page you are looking for does not exist.</p>
      <a class="text-blue-500 mt-4 inline-block" routerLink="/login">Go to Login</a>
    </div>
  `
})
export class NotFoundPageComponent {}
