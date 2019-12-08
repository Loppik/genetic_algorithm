import { Component, OnInit } from '@angular/core';
import { MatrixService } from '../matrix.service';

@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.scss']
})
export class MatrixComponent implements OnInit {
  constructor(private matrixService: MatrixService) { }

  ngOnInit() {}

  onMatrixItemChange(event, i, j) {
    let newValue = Number(event.target.value);
    if (newValue < -10) { newValue = -10; }
    if (newValue > 10) { newValue = 10; }
    this.matrixService.setItemValue(newValue, i, j);
  }
}
