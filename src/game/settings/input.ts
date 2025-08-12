/**
 * @file Declares & defines various input settings.
 * @author Tristan Bonsor <kidthales@agogpixel.com>
 * @copyright 2025 Tristan Bonsor <https://www.gnu.org/licenses/agpl-3.0.txt>
 */

import { GamepadInput, NormalizedInput } from '../enums/input';

export type KeyboardInputMap = Record<NormalizedInput, KeyboardEvent['code']>;

export const keyboardInputMap: KeyboardInputMap = {
  [NormalizedInput.Down]: 'ArrowDown',
  [NormalizedInput.Up]: 'ArrowUp',
  [NormalizedInput.Left]: 'ArrowLeft',
  [NormalizedInput.Right]: 'ArrowRight',
  [NormalizedInput.Pause]: 'KeyP',
  [NormalizedInput.OK]: 'Enter',
  [NormalizedInput.Cancel]: 'Backspace',
  [NormalizedInput.Shoot]: 'Space'
};

export type GamepadInputMap = Record<NormalizedInput, GamepadInput>;

export const gamepadInputMap: GamepadInputMap = {
  [NormalizedInput.Down]: GamepadInput.Down,
  [NormalizedInput.Up]: GamepadInput.Up,
  [NormalizedInput.Left]: GamepadInput.Left,
  [NormalizedInput.Right]: GamepadInput.Right,
  [NormalizedInput.Pause]: GamepadInput.Start,
  [NormalizedInput.OK]: GamepadInput.A,
  [NormalizedInput.Cancel]: GamepadInput.B,
  [NormalizedInput.Shoot]: GamepadInput.X
};
