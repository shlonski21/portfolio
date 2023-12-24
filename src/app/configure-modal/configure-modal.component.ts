import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { SettingsAdjustments } from '../agent-based-model/utilities/AgentBasedModel';

@Component({
  selector: 'app-configure-modal',
  templateUrl: './configure-modal.component.html',
  styleUrls: ['./configure-modal.component.scss']
})
export class ConfigureModalComponent implements AfterViewInit {
  constructor(private readonly cd: ChangeDetectorRef) { };
  @ViewChild('editor') editorContainer: ElementRef<HTMLDivElement>;
  numOfTests = 0;
  settings: SettingsAdjustments;
  textareaDefault = `{
  "numberOfAgents": 1000,
  "heightPriority": [0.2, 0.1, 1],
  "vrPriority": [0.1, 0.1, 1],
  "weightPriority": [0.1, 0.1, 1],
  "agePriority": [0.1, 0.1, 1],
  "genderPriority": [0.1, 0.1, 1],
  "generationPriority": [0.1, 0.1, 1],
  "attractivenessPriority": [0.1, 0.1, 1]
}`
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.calculateNumberOfTests(this.convertToObjectSettings(this.textareaDefault));
      this.cd.detectChanges();
    }, 0);
  }

  convertToObjectSettings(value: string) {
    const settings = JSON.parse(value) as SettingsAdjustments;
    this.settings = settings;
    return settings;
  }

  inputListener({ target }: Event) {
    const textareaContainer = target as HTMLTextAreaElement;
    this.calculateNumberOfTests(this.convertToObjectSettings(textareaContainer.value));
  }


  calculateNumberOfTests(settings: SettingsAdjustments) {
    let numOfTests = 0;
    Object.keys(settings).forEach(key => {
      if (Array.isArray(settings[key])) {
        const arr = settings[key] as [number, number, number];
        if (numOfTests === 0) {
          numOfTests += (((arr[2] - arr[0]) / arr[1]) + 1);
        } else {
          numOfTests *= (((arr[2] - arr[0]) / arr[1]) + 1);
        }
      }
    })
    this.numOfTests = numOfTests;
  }

}
