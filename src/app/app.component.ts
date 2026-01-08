import { Component } from '@angular/core';
import { ConsumeSafeComponent } from './consume-safe/consume-safe.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ConsumeSafeComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ConsumeSafe';
}