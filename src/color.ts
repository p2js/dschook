export const colors = {
    hexCode: (code: string) => parseInt(code.startsWith('#') ? code.slice(1) : code, 16),
    rgb: (r: number, g: number, b: number): number => (r << 16) | (g << 8) | b,
    hsl: (h: number, s: number, l: number): number => {
        const k = (n: number) => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);

        const f = (n: number) =>
            l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

        const r = Math.round(255 * f(0));
        const g = Math.round(255 * f(8));
        const b = Math.round(255 * f(4));

        return (r << 16) | (g << 8) | b;
    },
    hsv: (h: number, s: number, v: number): number => {
        const c = v * s;
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        const m = v - c;

        let r = 0, g = 0, b = 0;

        if (h < 60) { r = c; g = x; b = 0; }
        else if (h < 120) { r = x; g = c; b = 0; }
        else if (h < 180) { r = 0; g = c; b = x; }
        else if (h < 240) { r = 0; g = x; b = c; }
        else if (h < 300) { r = x; g = 0; b = c; }
        else { r = c; g = 0; b = x; }

        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);

        return (r << 16) | (g << 8) | b;
    },
}