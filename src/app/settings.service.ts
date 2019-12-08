import {Injectable} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {Types} from '../types';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  groupCount: number;
  programmersCount: number;
  totalTime: number;
  maxProgrammersCountInGroup: number;
  type: Types = Types.ITERATION;
  iterationCount: number;

  groupCountChange: Subject<number> = new Subject<number>();
  programmersCountChange: Subject<number> = new Subject<number>();
  totalTimeChange: Subject<number> = new Subject<number>();
  typeChange: Subject<Types> = new Subject<Types>();
  iterationCountChange: Subject<number> = new Subject<number>();

  constructor() {
    this.groupCount = 2;
    this.programmersCount = 3;
    this.totalTime = 120;
    this.maxProgrammersCountInGroup = 3;
    this.iterationCount = 15;

    this.groupCountChange.subscribe((value) => {
      this.groupCount = value;
    });

    this.programmersCountChange.subscribe(value => this.programmersCount = value);
    this.totalTimeChange.subscribe(value => this.totalTime = value);
    this.typeChange.subscribe((value) => this.type = value);
    this.iterationCountChange.subscribe(value => this.iterationCount = value);
  }

  setGroupCount(count): number {
    let newValue = Number(count);
    if (newValue < 1) { newValue = 1; }
    this.groupCountChange.next(newValue);
    return this.groupCount;
  }
  setProgrammersCount(count): number {
    let newValue = Number(count);
    if (newValue < 3) { newValue = 3; }
    this.programmersCountChange.next(newValue);
    return this.programmersCount;
  }
  setTotalTime(value): void {
    this.totalTimeChange.next(Number(value));
  }

  setType(value: string) {
    let newType: Types;
    switch (value) {
      case Types.ITERATION: newType = Types.ITERATION; break;
      case Types.OPTIMAL: newType = Types.OPTIMAL; break;
    }
    this.typeChange.next(newType);
  }

  setIterationCount(count) {
    this.iterationCountChange.next(Number(count));
  }
}
