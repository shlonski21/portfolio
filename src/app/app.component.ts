import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ABMSettings } from './agent-based-model/utilities/abm-settings.model';
import { AgentBasedModelComponent } from './agent-based-model/agent-based-model.component';
import { Education, Generations, Race, SettingsAdjustments } from './agent-based-model/utilities/AgentBasedModel';
import { Agent } from './agent-based-model/utilities/Agent';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('simulation') simulation: AgentBasedModelComponent;
  settings: ABMSettings;
  results: { [key: string]: any }[] = [];
  testsToRun: ABMSettings[] = [];
  ngOnInit(): void {
    this.settings = new ABMSettings();
  }
  ngAfterViewInit(): void {
    // this.simulation.startSimulation();
  }


  testResults(abm: AgentBasedModelComponent) {
    this.results.push({
      testNumber: abm.testNumber,
      numberOfAgents: abm.numberOfAgents,
      currentStep: abm.currentStep,
      outlierChance: abm.outlierChance,
      minAge: abm.minAge,
      maxAge: abm.maxAge,
      minHeight: abm.minHeight,
      maxHeight: abm.maxHeight,
      minWeight: abm.minWeight,
      maxWeight: abm.maxWeight,
      educationPriority: abm.educationPriority,
      heightPriority: abm.heightPriority,
      genderPriority: abm.genderPriority,
      vrPriority: abm.vrPriority,
      generationPriority: abm.generationPriority,
      weightPriority: abm.weightPriority,
      agePriority: abm.agePriority,
      attractivenessPriority: abm.attractivenessPriority,
      agentsWithVR: abm.agentsWithVR,
      vrMatches: abm.vrMatches,
      nonVrMatches: abm.nonVrMatches,
      mixedMatches: abm.mixedMatches,
      isConverged: abm.isConverged,
      agents: abm.agents
    });
  }
  downloadResults() {
    this.convertAndDownload(this.results);
  }
  convertAndDownload(jsonData: any[], fileName: string = 'output.csv') {
    // Convert JSON to CSV
    const csv = this.convertToCsv(jsonData);

    // Create a Blob containing the CSV data
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    // Create a link element
    const link = document.createElement('a');

    // Create a URL for the Blob and set it as the href attribute of the link
    link.href = URL.createObjectURL(blob);

    // Set the download attribute with the desired file name
    link.download = fileName;

    // Append the link to the document
    document.body.appendChild(link);

    // Trigger a click on the link to start the download
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
  }

  private convertToCsv(data: any[]): string {
    const headers = Object.keys(data[0]).filter(key => key !== "agents");

    let csvRows: any[] = [];
    if (!("agents" in headers) || data.length <= 1) {
      csvRows.push(headers.join(','));
    }

    let firstRow = 0;
    for (const row of data) {
      if ("agents" in row && data.length > 1 && firstRow++ === 1) {
        csvRows.push(headers.join(','));
      }
      const values = headers.map(header => this.escapeCsvValue(row[header]));
      csvRows.push(values.join(','));

      if ("agents" in row) {
        const agents: any[] = [];
        const dataAgents = <Agent[]>row["agents"];
        dataAgents.forEach((agent, index) => {

          const agentIndex = dataAgents.findIndex(a => agent.matchedWith === a) + 1;
          agents.push({
            agentNumber: index + 1,
            generation: this.setGeneration(agent.generation),
            gender: agent.gender,
            age: agent.age,
            height: agent.height,
            weight: agent.weight,
            attractiveness: agent.attractiveness,
            race: this.setRace(agent.race),
            education: this.setEducation(agent.education),
            usesVR: agent.usesVR,
            foundMatch: agent.hasMatch,
            matchWidth: agentIndex !== 0 ? agentIndex : 0,
            createdDate: agent.createdDate.getTime(),
            matchedStep: agent.matchedStep,
            matchedDate: agent.hasMatch ? agent.matchedDate.getTime() : 0
          })
        });
        csvRows.push(this.convertToCsv(agents));
      }
    }

    return csvRows.join('\n');
  }

  private setEducation(education: Education) {
    switch (education) {
      case Education.CollegeUniversity:
        return "University";
      case Education.HighSchool:
        return "High School";
      case Education.None:
        return "None";
    }
  }
  private setRace(race: Race) {
    switch (race) {
      case Race.NonWhite:
        return "Non White";
      case Race.White:
        return "White";
    }
  }

  private setGeneration(generation: Generations) {
    switch (generation) {
      case Generations.GenerationAlpha:
        return "Alpha";
      case Generations.GenerationY:
        return "Y";
      case Generations.GenerationZ:
        return "Z";
    }
  }

  private escapeCsvValue(value: any): string {
    if (typeof value === 'string' && value.includes(',')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
}
