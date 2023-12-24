import { Education, Gender, Generations, Race } from "./AgentBasedModel";

export const ShapeColors: string[] = ["#f3d050", "#D7F3FE", "#73cf8b"];
export const StrokeColor: string[] = ["#024763"];

export class Agent {
    public x: number;
    public y: number;
    private color: string;
    public hasMatch: boolean = false;
    public matchedWith: Agent | null;
    public maxCloseDistance = 10;

    public createdDate: Date;
    public matchedStep: number = 0;
    public matchedDate: Date;

    constructor(
        public generation: Generations,
        public attractiveness: number,
        public height: number,
        public weight: number,
        public age: number,
        public race: Race,
        public education: Education,
        public usesVR: boolean,
        public gender: Gender
    ) {
        this.generation = generation;
        this.attractiveness = attractiveness;
        this.height = height;
        this.weight = weight;
        this.age = age;
        this.race = race;
        this.education = education;
        this.usesVR = usesVR;
        this.x = Math.random() * 800; // Initial x-coordinate
        this.y = Math.random() * 850; // Initial y-coordinate
        this.color = ShapeColors[this.generation];
        this.hasMatch = false;
        this.matchedWith = null;
        this.createdDate = new Date();
    }

    // Function to draw the agent on the canvas
    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = "#024763";
        ctx.lineWidth = 1;
        if (this.usesVR) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.strokeStyle = "#024763";
            ctx.lineWidth = 3;
            ctx.closePath();
        }

        // Draw line to matched agent
        if (this.matchedWith?.matchedWith && this === this.matchedWith?.matchedWith) {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.matchedWith.x, this.matchedWith.y);
            ctx.strokeStyle = "black";
            ctx.stroke();
            ctx.closePath();
        }
        ctx.closePath();
    }

    setMatchedStep(step: number) {
        this.matchedStep = step;
    }

    setMatchedDate() {
        this.matchedDate = new Date();
    }

    // Function to move the agent towards a target position
    moveTo(x: number, y: number) {
        const dx = x - this.x;
        const dy = y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Move only if the distance is greater than max close distance
        if (distance > this.maxCloseDistance) {
            // Move a fraction of the distance
            const fraction = 0.05;
            this.x += dx * fraction;
            this.y += dy * fraction;
        }
    }
}
