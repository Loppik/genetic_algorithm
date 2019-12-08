import {Component, OnInit} from '@angular/core';
import {SettingsService} from '../settings.service';
import {MatrixService} from '../matrix.service';
import {start} from '../../algo';
import {Types} from '../../types';

@Component({
  selector: 'app-main-graph',
  templateUrl: './main-graph.component.html',
  styleUrls: ['./main-graph.component.scss']
})
export class MainGraphComponent implements OnInit {

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels = [];
  public barChartType = 'line';
  public barChartLegend = true;
  public barChartData = [];
  public barChartDataAverage = [];
  public X;
  resultArray;
  bestResult;
  groups = [];

  constructor(private settingsService: SettingsService, private matrixService: MatrixService ) {
    this.matrixService.namesChange.subscribe(newNames => {
      if (this.X) {
        this.bestResult = this.createBestResult(this.X[0]);
      }
    });
  }

  ngOnInit() {
  }

  onGenerateClick() {
    [this.resultArray, this.barChartLabels, this.X, this.barChartDataAverage] = start(
      this.settingsService.groupCount,
      this.settingsService.programmersCount,
      this.matrixService.matrix,
      this.settingsService.iterationCount,
      this.settingsService.type === Types.OPTIMAL,
      this.settingsService.totalTime,
    );
    this.resultArray = this.resultArray.map((line, index) => ({...line, isShow: false, id: index}));
    this.barChartData = this.resultArray.filter((line) => line.isShow);
    this.bestResult = this.createBestResult(this.X[0]);
    this.groups = this.bestResult.map((el, index) => index + 1);
  }

  createBestResult(X: number[]) {
    const bestResult = [];
    const result = X.map((groupNumber, programmerIndex) => ({ programmerIndex, groupNumber }));
    for (let i = 0; i < this.settingsService.groupCount; i++) {
      bestResult.push(result.filter((el) => el.groupNumber === i + 1).map((el) => this.matrixService.names[el.programmerIndex]));
    }
    return bestResult;
  }
}
