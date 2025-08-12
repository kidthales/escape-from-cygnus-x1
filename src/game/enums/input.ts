/**
 * @file Declares & defines various input enumerations.
 * @author Tristan Bonsor <kidthales@agogpixel.com>
 * @copyright 2025 Tristan Bonsor <https://www.gnu.org/licenses/agpl-3.0.txt>
 */

export enum InputDevice {
  Keyboard,
  Gamepad
}

export enum InputState {
  Pressed,
  Released,
  JustPressed,
  JustReleased
}

export enum GamepadInput {
  A = 0,
  B = 1,
  X = 2,
  Y = 3,
  L1 = 4,
  R1 = 5,
  L2 = 6,
  R2 = 7,
  Select = 8,
  Start = 9,
  Up = 12,
  Down = 13,
  Left = 14,
  Right = 15
}

export enum NormalizedInput {
  Up,
  Right,
  Down,
  Left,
  Pause,
  OK,
  Cancel,
  Shoot
}
