import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, Observable, ReplaySubject, Subject, filter, shareReplay, takeUntil } from 'rxjs';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, OnDestroy {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  percent$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  percentValue = 0;
  prevPercentValue = -1;
  numOfTestsToCalculate: number = 0;
  etaStarted: Date = new Date();
  etaFinish: Date = new Date();
  estimatedTimeToFinish: string;
  constructor(private readonly cd: ChangeDetectorRef,
    public dialogRef: MatDialogRef<LoaderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit(): void {
    this.numOfTestsToCalculate = this.data.numOfTestsToCalculate;

    this.percent$.pipe(
      takeUntil(this.destroyed$),
      filter((currentVal) => currentVal != this.prevPercentValue)
    ).subscribe(val => {
      this.percentValue = val;
      this.prevPercentValue = val;
      // Calculate ETA
      // const elapsedTime = new Date().getTime() - this.etaStarted.getTime();
      // const estimatedTotalTime = elapsedTime * this.numOfTestsToCalculate;
      // this.etaFinish = new Date(this.etaStarted.getTime() + estimatedTotalTime);
      // const remainingTime = this.etaFinish.getTime() - new Date().getTime();
      // this.estimatedTimeToFinish = this.formatTime(remainingTime);
      // this.etaStarted = new Date();
      this.cd.detectChanges();
      if (val >= 100) {
        this.dialogRef.close();
      }
    })
  }
  
  // Function to format milliseconds to HH:MM:SS
  formatTime(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(remainingSeconds)}`;
  }

  // Function to pad single-digit numbers with a leading zero
  pad(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
