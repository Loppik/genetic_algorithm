import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service';
import { random } from '../helpers';
import {Observable, of, Subject} from 'rxjs';

type TMatrix = number[][];

const NAMES = ['Пётр', 'Павел', 'Патрик', 'Педро', 'Олег', 'Матвей', 'Кирилл'];

@Injectable({
  providedIn: 'root'
})
export class MatrixService {
  matrix: TMatrix;
  matrixChange: Subject<TMatrix> = new Subject<TMatrix>();
  names: string[];
  namesChange: Subject<string[]> = new Subject<string[]>();

  defaultValue = 0;
  size;
  minRandomValue = -10;
  maxRandomValue = 10;

  constructor(private settingsService: SettingsService) {
    this.matrixChange.subscribe(value => this.matrix = value);
    this.namesChange.subscribe(value => this.names = value);
    this.size = this.settingsService.groupCount;
    this.settingsService.programmersCountChange.subscribe(value => {
      this.matrix = this.changeSize(value);
      this.matrix = this.randomize();
      this.randomizeNames();
    });
    this.matrix = this.changeSize(this.size);
    this.matrix = this.randomize();
  }

  changeSize(newSize: number): TMatrix {
    const newMatrix = [];
    const newRow = [];
    for (let i = 0; i < newSize; i++) {
      newRow.push(this.defaultValue);
    }
    for (let i = 0; i < newSize; i++) {
      newMatrix.push([...newRow]);
    }
    this.matrixChange.next(newMatrix);
    this.size = newSize;
    return this.matrix;
  }

  setItemValue(newValue, i, j): TMatrix {
    const matrixCopy = [...this.matrix];
    matrixCopy[i][j] = newValue;
    this.matrix = [...matrixCopy];
    return this.matrix;
  }

  randomize(): TMatrix {
    const newMatrix = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.matrix.length; i++) {
      const newRow = [];
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < this.matrix.length; j++) {
        newRow.push(random(this.minRandomValue, this.maxRandomValue));
      }
      newMatrix.push(newRow);
    }
    this.matrixChange.next(newMatrix);
    return this.matrix;
  }

  setName(newValue, index) {
    const namesCopy = [...this.names];
    namesCopy[index] = newValue;
    this.namesChange.next(namesCopy);
  }

  randomizeNames() {
    const newNames = [];
    const availableNames = [...NAMES];
    for (let i = 0; i < this.size; i++) {
      const rand = random(0, availableNames.length - 1);
      const name = availableNames[rand];
      availableNames.splice(rand, 1);
      newNames.push(name);
    }
    this.namesChange.next(newNames);
  }
}
