import {Component} from '@angular/core';
import {SettingsService} from '../settings.service';
import {Types} from '../../types';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  iterationType: Types = Types.ITERATION;
  optimalType: Types = Types.OPTIMAL;

  constructor(private settingsService: SettingsService) { }
}
