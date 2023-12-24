export enum Generations {
    GenerationAlpha = 0,
    GenerationZ = 1,
    GenerationY = 2
}

export enum Gender {
    Male = 1,
    Female = 2,
    Other = 3
}

export enum Race {
    White,
    NonWhite
}

export enum Education {
    None,
    HighSchool,
    CollegeUniversity
}

export interface SettingsAdjustments {
    [key: string]: [number, number, number] | number,
    numberOfAgents: number,
    educationPriority: [number, number, number],
    heightPriority: [number, number, number],
    genderPriority: [number, number, number],
    vrPriority: [number, number, number],
    generationPriority: [number, number, number],
    weightPriority: [number, number, number],
    agePriority: [number, number, number],
    attractivenessPriority: [number, number, number],
}