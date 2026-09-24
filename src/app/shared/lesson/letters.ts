/** The alphabet, and the colour each letter wears — shared by the board, the examples and the spelling keyboard. */
export const ALL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
export const LETTER_COLOR = (i: number) => ['var(--red)', 'var(--blue)', 'var(--yellow)', 'var(--teal)', 'var(--purple)', 'var(--orange)', 'var(--green)'][Math.min(6, Math.floor(i / 4))];
