import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Agent } from './utilities/Agent';
import { Education, Gender, Generations, Race, SettingsAdjustments } from './utilities/AgentBasedModel';
import { ABMSettings } from './utilities/abm-settings.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfigureModalComponent } from '../configure-modal/configure-modal.component';
import { BehaviorSubject, filter } from 'rxjs';
import { LoaderComponent } from './loader/loader.component';

@Component({
  selector: 'app-agent-based-model',
  templateUrl: './agent-based-model.component.html',
  styleUrls: ['./agent-based-model.component.scss']
})
export class AgentBasedModelComponent implements OnInit, AfterViewInit {
  private _settings: ABMSettings;
  get settings() {
    return this._settings;
  }
  @Input('settings') set settings(value: ABMSettings) {
    this._settings = !value ? new ABMSettings() : value;
    this.stopAfterXSteps = this._settings.stopAfterXSteps;
    this.numberOfAgents = this._settings.numberOfAgents;
    this.outlierChance = this._settings.outlierChance;
    this.minAge = this._settings.minAge;
    this.maxAge = this._settings.maxAge;
    this.minHeight = this._settings.minHeight;
    this.maxHeight = this._settings.maxHeight;
    this.minWeight = this._settings.minWeight;
    this.maxWeight = this._settings.maxWeight;
    this.educationPriority = this._settings.educationPriority;
    this.heightPriority = this._settings.heightPriority;
    this.genderPriority = this._settings.genderPriority;
    this.vrPriority = this._settings.vrPriority;
    this.generationPriority = this._settings.generationPriority;
    this.weightPriority = this._settings.weightPriority;
    this.agePriority = this._settings.agePriority;
    this.attractivenessPriority = this._settings.attractivenessPriority;
  }
  @Output('testResults') testResults: EventEmitter<AgentBasedModelComponent> = new EventEmitter<AgentBasedModelComponent>();
  @Output('downloadResults') downloadResults: EventEmitter<void> = new EventEmitter<void>();
  constructor(private readonly cd: ChangeDetectorRef, public readonly dialog: MatDialog) { };
  // Env 
  @ViewChild("simulationCanvas", { static: true }) simulationCanvas: ElementRef<HTMLCanvasElement>;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  [key: string]: any;

  numOfTestsToCalculate = 1;

  // Agent Based Model Configuration
  agents: Agent[];
  testNumber = 0;
  currentAgentIndex: number = 0;
  simulationRunning: boolean = false;
  simulationRan: boolean = false;
  simulationInterval: any;
  currentStep: number = 0;
  generations: Generations[] = [Generations.GenerationAlpha, Generations.GenerationY, Generations.GenerationZ];
  outlierChance: number = 5;
  stopAfterXSteps: number = 1000;
  numberOfAgents: number = 100;
  isConverged: boolean = false;
  testsToRun: ABMSettings[] = [this.settings];
  startedTestsRun: boolean = false;
  testsRunInterupted: boolean = false;

  // Counters
  agentsWithVR: number = 0;
  vrMatches: number = 0;
  nonVrMatches: number = 0;
  mixedMatches: number = 0;

  // Setup Form
  minAge: number = 18;
  maxAge: number = 50;
  minHeight: number = 150;
  maxHeight: number = 200;
  minWeight: number = 50;
  maxWeight: number = 100;
  framePerSecond: number = 33;

  // Priorities
  educationPriority: number = 0.3;
  heightPriority: number = 0.2;
  genderPriority: number = 0.1;
  vrPriority: number = 0.1;
  generationPriority: number = 0.1;
  weightPriority: number = 0.1;
  agePriority: number = 0.1;
  attractivenessPriority: number = 0.2;

  percent$: BehaviorSubject<number>;

  ngOnInit(): void {
    this.setCanvasContext();
    this.initializeAgents();
    this.drawAgents();
  }

  ngAfterViewInit(): void { }

  private setCanvasContext() {
    this.canvas = this.simulationCanvas.nativeElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
  }

  confiureModal() {
    const dialogRef = this.dialog.open(ConfigureModalComponent);

    dialogRef.afterClosed().pipe(filter(result => result)).subscribe(async (result) => {
      this.resetSimulation();
      this.testNumber = 0;
      this.numOfTestsToCalculate = dialogRef.componentInstance.numOfTests;
      this.numberOfAgents = dialogRef.componentInstance?.settings?.numberOfAgents ?? 100;
      const loaderRef = this.dialog.open(LoaderComponent, {
        disableClose: true,
        data: {
          numOfTestsToCalculate: this.numOfTestsToCalculate
        }
      });
      this.percent$ = loaderRef.componentInstance.percent$;
      loaderRef.afterClosed().subscribe(() => {
        this.resetSimulation();
        this.cd.detectChanges();
      })
      this.testsToRun = await this.generateAllPossibleSettingsAsync(dialogRef.componentInstance.settings);
      this.cd.detectChanges();
    });
  }

  setLoader = (testCalculated: number) => {
    setTimeout(() => {
      const percent = parseInt(`${(testCalculated * 100) / this.numOfTestsToCalculate}`, 10);
      this.percent$.next(percent);
    }, 250);
  }

  async generateAllPossibleSettingsAsync(propertiesRanges: SettingsAdjustments): Promise<ABMSettings[]> {
    const settingsList: ABMSettings[] = [];
    const fieldNames = Object.keys(propertiesRanges);

    async function generateSettingsForField(settings: ABMSettings, fieldNameIndex: number, setLoader: Function): Promise<void> {
      if (fieldNameIndex === fieldNames.length) {
        // If all fields are processed, add the settings to the list
        settingsList.push({ ...settings });
        setLoader(settingsList.length);
        return;
      }

      const fieldName = fieldNames[fieldNameIndex];

      if (Array.isArray(propertiesRanges[fieldName])) {
        const prioritiesRange = propertiesRanges[fieldName] as [number, number, number];

        const start = prioritiesRange[0];
        const tick = prioritiesRange[1];
        const max = prioritiesRange[2];

        const chunkSize = 100; // Adjust the chunk size based on your requirements
        const chunks = Math.ceil((max - start) / chunkSize);

        for (let i = 0; i < chunks; i++) {
          const chunkStart = start + i * chunkSize;
          const chunkEnd = Math.min(start + (i + 1) * chunkSize, max);

          await new Promise(resolve => setTimeout(resolve, 0)); // Allow event loop to handle other tasks

          for (let priority = chunkStart; priority <= chunkEnd; priority += tick) {
            settings[fieldName] = priority;
            await generateSettingsForField({ ...settings }, fieldNameIndex + 1, setLoader);
          }
        }
      } else {
        const newFieldValue = propertiesRanges[fieldName] as number;
        settings[fieldName] = newFieldValue;
        await generateSettingsForField({ ...settings }, fieldNameIndex + 1, setLoader);
      }
    }

    await generateSettingsForField(new ABMSettings(), 0, this.setLoader);

    return settingsList;
  }
  generateAllPossibleSettings(propertiesRanges: SettingsAdjustments): ABMSettings[] {
    const settingsList: ABMSettings[] = [];

    const fieldNames = Object.keys(propertiesRanges);

    const generateSettingsForField = (settings: ABMSettings, fieldNameIndex: number): void => {

      if (fieldNameIndex === fieldNames.length) {
        // If all fields are processed, add the settings to the list
        settingsList.push({ ...settings });
        return;
      }

      const fieldName = fieldNames[fieldNameIndex];
      if (Array.isArray(propertiesRanges[fieldName])) {
        const prioritiesRange = propertiesRanges[fieldName] as [number, number, number];

        const start = prioritiesRange[0];
        const tick = prioritiesRange[1];
        const max = prioritiesRange[2];
        const listOfTicks = [];
        let i = start;
        while (i < max + tick) {
          listOfTicks.push(i);
          i = Number((i + tick).toFixed(2));
        }

        for (const priority of listOfTicks) {
          settings[fieldName] = priority;
          generateSettingsForField(settings, fieldNameIndex + 1);
        }
      } else {
        const newFieldValue = propertiesRanges[fieldName] as number;
        settings[fieldName] = newFieldValue;
        generateSettingsForField(settings, fieldNameIndex + 1);
      }
    };

    generateSettingsForField(new ABMSettings(), 0);

    return settingsList;
  }

  formatLabel(value: number): string {
    if (value >= 0 && value < 33) {
      return "Slow";
    } else if (value >= 33 && value < 66) {
      return "Normal";
    } else if (value >= 66 && value < 99) {
      return "Fast";
    } else {
      return "Fastest";
    }
  }

  setValues(prop: string, event: Event) {
    switch (prop) {
      default:
        this[prop] = parseInt((event.target as HTMLInputElement).value, 10);
        break;
      case "framePerSecond":
        this.framePerSecond = parseInt((event.target as HTMLInputElement).value, 10);
        this.framePerSecond = this.framePerSecond < 5 ? 5 : this.framePerSecond;
        break;
    }
  }

  startSimulation() {
    if (this.simulationRunning) return;
    if (this.checkStopCondition()) return;
    this.simulationRunning = true;
    this.simulationRan = true;
    if (this.testsToRun.length > 1) {
      this.settings = this.testsToRun[this.testNumber];
      this.startedTestsRun = true;
    }
    if (this.testsRunInterupted) {
      this.testsRunInterupted = false;
    } else {
      this.testNumber++;
    }
    this.startSimulationLoop();
  }

  startSimulationLoop() {
    this.simulationInterval = setInterval(() => {
      this.currentStep++;
      this.stepSimulation();
      this.drawAgents();
      this.cd.detectChanges();

      if (this.checkStopCondition()) {
        this.stopSimulation();
        this.cd.detectChanges();
      }
    }, 1000 / this.framePerSecond);
  }

  stopSimulationButton() {
    this.testsRunInterupted = true;
    this.stopSimulation(true);
  }

  stopSimulation(stopAnyway: boolean = false) {
    if (this.simulationRunning || stopAnyway) {
      this.simulationRunning = false;
      // this.startedTestsRun = false;
      clearInterval(this.simulationInterval);
      if (this.simulationRan) {
        if (!this.testsRunInterupted) {
          this.testResults.emit(this);
        }
        if (this.testNumber < this.testsToRun.length && this.testsToRun.length > 1 && !stopAnyway) {
          this.resetSimulation();
          this.startSimulation();
        }
      }
    }
  }

  stepOneForwardSimulation() {
    this.startSimulation();
    setTimeout(() => this.stopSimulation(), 1000 / this.framePerSecond);
  }

  resetSimulation() {
    this.simulationRan = false;
    this.currentStep = 0;
    this.currentAgentIndex = 0;
    this.isConverged = false;
    this.stopSimulation(true);
    this.resetMatchCounters();
    this.initializeAgents();
    this.drawAgents();
  }

  initializeAgents() {
    this.agents = [];

    for (let i = 0; i < this.numberOfAgents; i++) {
      const generation = this.getRandomGeneration();
      const attractiveness = Math.random();
      const height = this.getRandomInRange(this.minHeight, this.maxHeight); // height in cm
      const weight = this.getRandomInRange(this.minWeight, this.maxWeight); // weight in kg
      const age = this.getRandomInRange(this.minAge, this.maxAge); // age
      const race = Math.random() > 0.5 ? Race.White : Race.NonWhite; // 50% chance of being white
      const education = this.getRandomEducation(); // 50% chance of having college education
      const usesVR = Math.random() > this.generateUsesVR(generation); // 50% chance of using virtual reality
      const gender = this.getRandomGender();

      this.agents.push(
        new Agent(
          generation,
          attractiveness,
          height,
          weight,
          age,
          race,
          education,
          usesVR,
          gender
        )
      );
    }
    this.agentsWithVR = this.agents.filter(a => a.usesVR).length;
  }

  getRandomGender(): Gender {
    const genders = [Gender.Male, Gender.Female, Gender.Other];
    return genders[Math.floor(Math.random() * genders.length)];
  }

  getRandomEducation(): Education {
    const educations = [Education.None, Education.HighSchool, Education.CollegeUniversity];
    return educations[Math.floor(Math.random() * educations.length)];
  }

  getRandomGeneration() {
    const rand = Math.random();
    if (rand < 0.3) {
      return Generations.GenerationAlpha;
    } else if (rand < 0.6) {
      return Generations.GenerationZ;
    } else {
      return Generations.GenerationY;
    }
  }

  generateUsesVR(generation: Generations) {
    // Adjust the chance based on generation
    switch (generation) {
      case Generations.GenerationAlpha:
        return 0.2; // Higher chance for Generation Alpha
      case Generations.GenerationZ:
        return 0.5; // Slight chance for Generation Z
      case Generations.GenerationY:
        return 0.8; // Slight chance for Generation Y
      default:
        return 0.5; // Default to 50% chance
    }
  }

  stepSimulation() {
    if (this.currentAgentIndex < this.agents.length) {
      const currentAgent = this.agents[this.currentAgentIndex];
      const matchingAgents = this.agents.filter((a) => !a.hasMatch && a !== currentAgent && (a.generation === currentAgent.generation || Math.random() < this.outlierChance / 100));

      if (matchingAgents.length > 0) {
        // Find the most similar agent based on a similarity function
        const target = this.findMostSuitableAgent(currentAgent, matchingAgents);
        if (target) {
          while (this.calculateDistance(currentAgent, target) > 20) {
            currentAgent.moveTo(target.x, target.y);
          }

          if (this.calculateDistance(currentAgent, target) <= 20) {
            target.hasMatch = true;
            currentAgent.hasMatch = true;
            currentAgent.matchedWith = target;
            target.matchedWith = currentAgent;
            target.setMatchedDate();
            target.setMatchedStep(this.currentStep);
            currentAgent.setMatchedDate();
            currentAgent.setMatchedStep(this.currentStep);
          }

          // Update match counters
          if (currentAgent.usesVR && target.usesVR) {
            this.vrMatches++;
          } else if (!currentAgent.usesVR && !target.usesVR) {
            this.nonVrMatches++;
          } else {
            this.mixedMatches++;
          }
        }
      }

      this.currentAgentIndex++;
    }

    // Check for stop condition
    if (this.checkStopCondition()) {
      this.stopSimulation();
    }
  }

  calculateDistance(agentA: Agent, agentB: Agent) {
    const dx = agentA.x - agentB.x;
    const dy = agentA.y - agentB.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  findMostSuitableAgent(agent: Agent, candidates: Agent[]): Agent | null {
    // Define a suitability function based on preferences
    const calculateSuitability = (a: Agent, b: Agent) => {
      // Example: prioritize education, height, and gender
      const educationPriority = this.educationPriority;
      const heightPriority = this.heightPriority;
      const genderPriority = this.genderPriority;
      const vrPriority = this.vrPriority;
      const generationPriority = this.generationPriority;
      const weightPriority = this.weightPriority;
      const agePriority = this.agePriority;
      const attractivenessPriority = this.attractivenessPriority;

      const attractivenessDiff = Math.abs(a.attractiveness - b.attractiveness);
      const heightDiff = Math.abs(a.height - b.height);
      const weightDiff = Math.abs(a.weight - b.weight);
      const ageDiff = Math.abs(a.age - b.age);

      // Height priority
      const heightSimilarity = 1 - heightDiff / 50; // Adjust the range based on your preferences
      const attractivenessSimilarity = 1 - attractivenessDiff / 100;
      const weightSimilarity = 1 - weightDiff / 50; // Adjust the range based on your preferences
      const ageSimilarity = 1 - ageDiff / 50; // Adjust the range based on your preferences

      let suitability =
        attractivenessPriority * attractivenessSimilarity +
        heightPriority * heightSimilarity +
        weightSimilarity +
        agePriority * ageSimilarity;

      // Education priority
      if (a.education === b.education) {
        suitability += educationPriority;
      }
      suitability += heightPriority * heightSimilarity;

      // Gender priority
      if (a.gender !== b.gender) {
        suitability += genderPriority;
      }

      // VR priority
      if (a.usesVR === b.usesVR) {
        suitability += vrPriority;
      }

      // VR priority
      if (a.generation === b.generation) {
        suitability += generationPriority;
      }

      // VR priority
      if (a.weight === b.weight) {
        suitability += weightPriority;
      }

      return suitability;
    };

    // Find the agent with the highest suitability
    let maxSuitability = -1;
    let mostSuitableAgent = null;

    for (const candidate of candidates) {
      const suitability = calculateSuitability(agent, candidate);

      if (suitability > maxSuitability) {
        maxSuitability = suitability;
        mostSuitableAgent = candidate;
      }
    }

    return mostSuitableAgent;
  }

  checkStopCondition() {
    this.isConverged = true;
    if (this.currentStep >= this.stopAfterXSteps) {
      this.isConverged = false;
    }
    return this.allAgentsMatched() || this.currentStep >= this.stopAfterXSteps;
  }

  drawAgents() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.agents.forEach(agent => {
      agent.draw(this.ctx);
    });
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  allAgentsMatched() {
    // Adjust the threshold as needed, e.g., 90% of agents have a match
    const matchThreshold = 0.9;

    const matchingAgentsCount = this.agents.filter((agent) => agent.hasMatch).length;
    const matchingPercentage = matchingAgentsCount / this.agents.length;

    return matchingPercentage >= matchThreshold;
  }

  resetMatchCounters() {
    this.vrMatches = 0;
    this.nonVrMatches = 0;
    this.mixedMatches = 0;
  }

  getRandomInRange(min: number, max: number): number {
    if (max > min) return this.getRandomInRange(max, min);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
