export class ABMSettings {
    [key: string]: any;
    constructor(
        public stopAfterXSteps: number = 1000,
        public numberOfAgents: number = 100,
        public outlierChance: number = 5,
        public minAge: number = 18,
        public maxAge: number = 50,
        public minHeight: number = 150,
        public maxHeight: number = 200,
        public minWeight: number = 50,
        public maxWeight: number = 100,
        public educationPriority: number = 0.3,
        public heightPriority: number = 0.2,
        public genderPriority: number = 0.1,
        public vrPriority: number = 0.1,
        public generationPriority: number = 0.1,
        public weightPriority: number = 0.1,
        public agePriority: number = 0.1,
        public attractivenessPriority: number = 0.2,
    ) { }
}