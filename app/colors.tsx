
export const colors = {
    background1: "#000000",
    background2: "#151515",
    background3: "#222222",
    grey: "#444444",
    text_color1: "#ffffff",
}

export const taskColors = {
    red: { background: "#8B0000", top: "#660000" },
    blue: { background: "#00008B", top: "#000066" },
    green: { background: "#006400", top: "#004d00" },
    purple: { background: "#4B0082", top: "#380061" },
    orange: { background: "#CC5500", top: "#994000" },
    teal: { background: "#008080", top: "#006666" },
    pink: { background: "#C71585", top: "#9B1169" },
    brown: { background: "#8B4513", top: "#6B350F" },
}

export type TaskColorKey = keyof typeof taskColors;

export default colors;