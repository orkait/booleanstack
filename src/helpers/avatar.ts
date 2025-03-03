/**
 * PRNG function using XorShift algorithm
 * @param inputString String to use as seed
 * @param length Length of output hex string
 * @returns Hex string of specified length
 */
export function prngXorShift(inputString: string, length = 32): string {
    let seed = [...inputString].reduce((acc, char) => (acc + char.charCodeAt(0)) & 0xFFFFFFFF, 0);
    let state = ((seed << 13) ^ seed) >>> 0;  // Ensure unsigned 32-bit

    function xorshift(n: number): number {
        n ^= ((n << 7) & 0xFFFFFFFF);
        n ^= ((n >>> 9) & 0xFFFFFFFF);  // JS uses >>> for unsigned shift
        n ^= ((n << 8) & 0xFFFFFFFF);
        return n >>> 0;  // Ensure unsigned 32-bit integer
    }

    let output: string[] = [];
    for (let i = 0; i < Math.ceil(length / 8); i++) {
        state = xorshift(state);
        output.push(state.toString(16).padStart(8, '0')); // Ensure 8-char hex
    }

    return output.join("").slice(0, length);
}

/**
 * Avatar generator class using SVG
 */
class Avatar {
    private box: number;
    private bgColor: string;
    private color: string;
    private block: number;
    private points: { [key: number]: [number, number] } = {};
    private pattern: number[] = [];

    /**
     * Constructor for AvatarSVG
     * @param options Configuration options
     */
    constructor(options: {
        box?: number;
        bgColor?: string;
        color?: string;
        seed?: string;
    } = {}) {
        this.box = options.box || 500;
        this.bgColor = options.bgColor || this.getRandomColor(options.seed);
        this.color = options.color || this.getRandomColor(options.seed ? options.seed + "salt" : undefined);
        this.block = Math.floor(this.box / 5);

        // Initialize pattern with deterministic values if seed is provided
        this.generatePattern(options.seed);

        // Initialize coordinates mapping
        this.setupCoordinateMapping();
    }

    /**
     * Generates a color based on seed or randomly
     * @param seed Optional seed for deterministic color
     * @returns Hex color string
     */
    private getRandomColor(seed?: string): string {
        if (seed) {
            // Use the PRNG to generate a deterministic color
            const hex = prngXorShift(seed, 6);
            return `#${hex}`;
        } else {
            // Generate a random RGB color
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);

            // Convert to hex
            return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        }
    }

    /**
     * Generates a bit value (0 or 1) based on a seed and position
     * @param seed Seed string
     * @param position Position in the pattern
     * @returns 0 or 1
     */
    private generateBit(seed: string, position: number): number {
        const hash = prngXorShift(`${seed}-${position}`, 8);
        return parseInt(hash.charAt(0), 16) % 2;
    }

    /**
     * Fills the pattern array with deterministic or random values
     * @param seed Optional seed for deterministic pattern
     */
    private generatePattern(seed?: string): void {
        if (seed) {
            // Create a deterministic pattern using the seed
            const halfPattern: number[] = [];
            for (let i = 0; i < 15; i++) {
                halfPattern.push(this.generateBit(seed, i));
            }

            // Create the middle row (3 values)
            const middleRow = [
                this.generateBit(seed, 15),
                this.generateBit(seed, 16),
                this.generateBit(seed, 17)
            ];

            // Mirror the pattern for symmetry (excluding the middle column)
            this.pattern = [];

            // First two rows (10 values)
            for (let i = 0; i < 10; i++) {
                this.pattern.push(halfPattern[i]);
            }

            // Middle row with symmetry (5 values)
            this.pattern.push(middleRow[0], middleRow[1], middleRow[2], middleRow[1], middleRow[0]);

            // Last two rows mirrored (10 values)
            for (let i = 9; i >= 0; i--) {
                this.pattern.push(halfPattern[i]);
            }
        } else {
            // Random pattern with symmetry (same as before)
            const p1 = this.generateRandomRow();
            const p2 = this.generateRandomRow();
            const p3 = this.generateRandomRow();
            const p4 = [...p2]; // Mirror of p2
            const p5 = [...p1]; // Mirror of p1

            this.pattern = [...p1, ...p2, ...p3, ...p4, ...p5];
        }
    }

    /**
     * Generates a random row of 0s and 1s
     */
    private generateRandomRow(): number[] {
        const result: number[] = [];
        for (let i = 0; i < 5; i++) {
            result.push(Math.random() > 0.5 ? 1 : 0);
        }
        return result;
    }

    /**
     * Sets up the coordinate mapping for the 5x5 grid
     */
    private setupCoordinateMapping(): void {
        const coordinates = [0, this.block, this.block * 2, this.block * 3, this.block * 4];
        let number = 0;

        for (const y of coordinates) {
            for (const x of coordinates) {
                this.points[number] = [x, y];
                number++;
            }
        }
    }

    /**
     * Renders the avatar as an SVG string
     * @returns SVG markup as a string
     */
    public render(className = ""): string {
        let svg = `<svg xmlns="http://www.w3.org/2000/svg" class="${className}" viewBox="0 0 ${this.box} ${this.box}" width="${this.box}" height="${this.box}">`;

        // Background rectangle
        svg += `<rect width="${this.box}" height="${this.box}" fill="${this.bgColor}" />`;

        // Draw pattern blocks
        for (let i = 0; i < this.pattern.length; i++) {
            if (this.pattern[i] === 1) {
                const [x, y] = this.points[i];
                svg += `<rect x="${x}" y="${y}" width="${this.block}" height="${this.block}" fill="${this.color}" />`;
            }
        }

        svg += '</svg>';
        return svg;
    }

    /**
     * Converts the SVG to a data URL
     * @returns Data URL string
     */
    public toDataURL(): string {
        const svg = this.render();
        const encoded = encodeURIComponent(svg);
        return `data:image/svg+xml;charset=utf-8,${encoded}`;
    }

    /**
     * Creates an img element with the avatar
     * @returns HTML Image element
     */
    public toImage(): HTMLImageElement {
        const img = document.createElement('img');
        img.src = this.toDataURL();
        img.width = this.box;
        img.height = this.box;
        return img;
    }

    /**
     * Appends the avatar image to a DOM element
     * @param element DOM element or selector string
     */
    public appendTo(element: HTMLElement | string): void {
        const target = typeof element === 'string'
            ? document.querySelector(element) as HTMLElement
            : element;

        if (!target) {
            throw new Error('Target element not found');
        }

        const img = this.toImage();
        target.appendChild(img);
    }

    /**
     * Returns raw SVG element that can be directly added to the DOM
     * @returns SVG element
     */
    public toSVGElement(): SVGElement {
        const parser = new DOMParser();
        const doc = parser.parseFromString(this.render(), 'image/svg+xml');
        return doc.documentElement as unknown as SVGElement;
    }
}

export default Avatar;