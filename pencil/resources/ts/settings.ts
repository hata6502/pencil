export const CANVAS_WIDTH = 320
export const CANVAS_HEIGHT = 130
export const CANVAS_ZOOM = 2

export const DRAW_BRUSH = 'medium'
export const DRAW_COLOR = 'black'

export const IMAGE_URL = '/images/image.png'

interface Brush {
    fontsize: number
    pattern: number[][]
}

export const BRUSH_PATTERNS: { [key: string]: Brush } = {
    light: {
        fontsize: 12,
        pattern: [[1]]
    },
    medium: {
        fontsize: 24,
        pattern: [[0, 1, 0], [1, 1, 1], [0, 1, 0]]
    },
    bold: {
        fontsize: 36,
        pattern: [
            [0, 1, 1, 1, 1, 0],
            [1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 0]
        ]
    }
}

export const KEYCODE_UP = 38
export const KEYCODE_DOWN = 40
export const KEYCODE_LEFT = 37
export const KEYCODE_RIGHT = 39
export const KEYCODE_ENTER = 13

export const HISTORY_MAX_LENGTH = 11
