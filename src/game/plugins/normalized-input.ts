/**
 * @file Declares & defines the normalized input scene plugin.
 * @author Tristan Bonsor <kidthales@agogpixel.com>
 * @copyright 2025 Tristan Bonsor <https://www.gnu.org/licenses/agpl-3.0.txt>
 */

import { NormalizedInput, InputState, InputDevice, GamepadInput } from '../enums/input';
import { gamepadInputMap, keyboardInputMap } from '../settings/input';
import Stage from '../stage';

export interface INormalizedInputPlugin {
  query(input: NormalizedInput, state: InputState, forgiveness?: number): boolean;
}

interface InputEdge {
  pressed: boolean;
  timestamp: number;
}

/**
 * @static
 * @private
 */
let currentDevice: InputDevice = InputDevice.Keyboard;

/**
 * @static
 * @private
 */
const deviceInputEdges = {
  [InputDevice.Keyboard]: {} as Record<string, InputEdge>,
  [InputDevice.Gamepad]: {} as Record<GamepadInput, InputEdge>
};

export default class NormalizedInputPlugin extends Phaser.Plugins.ScenePlugin implements INormalizedInputPlugin {
  declare scene: Phaser.Scene;
  declare systems: Phaser.Scenes.Systems;

  static get pluginObjectItem(): Phaser.Types.Core.PluginObjectItem {
    return { key: 'NormalizedInputPlugin', plugin: NormalizedInputPlugin, mapping: 'normInput' };
  }

  boot() {
    if (!(this.scene instanceof Stage)) {
      return;
    }

    this.systems.events
      .once(Phaser.Scenes.Events.START, onSceneStart, this)
      .once(Phaser.Scenes.Events.DESTROY, onSceneDestroy, this);

    if (this.systems.settings.isBooted) {
      onSceneStart.call(this);
    }
  }

  query(input: NormalizedInput, state: InputState, forgiveness = 0) {
    let inputEdge: InputEdge | undefined;

    switch (currentDevice) {
      case InputDevice.Gamepad:
        inputEdge = deviceInputEdges[currentDevice][gamepadInputMap[input]];
        break;
      case InputDevice.Keyboard:
      default:
        inputEdge = deviceInputEdges[currentDevice][keyboardInputMap[input]];
        break;
    }

    if (inputEdge === undefined) {
      return false;
    }

    switch (state) {
      case InputState.JustPressed:
        return inputEdge.pressed && inputEdge.timestamp >= this.scene.time.now - forgiveness;
      case InputState.JustReleased:
        return !inputEdge.pressed && inputEdge.timestamp >= this.scene.time.now - forgiveness;
      case InputState.Released:
        return !inputEdge.pressed;
      case InputState.Pressed:
      default:
        return inputEdge.pressed;
    }
  }
}

function onSceneStart(this: NormalizedInputPlugin) {
  this.scene.input.keyboard?.on(Phaser.Input.Keyboard.Events.ANY_KEY_DOWN, onKeyDown, this);
  this.scene.input.keyboard?.on(Phaser.Input.Keyboard.Events.ANY_KEY_UP, onKeyUp, this);

  this.scene.input.gamepad?.on(Phaser.Input.Gamepad.Events.BUTTON_DOWN, onButtonDown, this);
  this.scene.input.gamepad?.on(Phaser.Input.Gamepad.Events.BUTTON_UP, onButtonUp, this);
}

function onSceneDestroy(this: NormalizedInputPlugin) {
  this.systems.events
    .off(Phaser.Scenes.Events.START, onSceneStart, this)
    .off(Phaser.Scenes.Events.DESTROY, onSceneDestroy, this);

  this.scene.input.keyboard?.off(Phaser.Input.Keyboard.Events.ANY_KEY_DOWN, onKeyDown, this);
  this.scene.input.keyboard?.off(Phaser.Input.Keyboard.Events.ANY_KEY_UP, onKeyUp, this);

  this.scene.input.gamepad?.off(Phaser.Input.Gamepad.Events.BUTTON_DOWN, onButtonDown, this);
  this.scene.input.gamepad?.off(Phaser.Input.Gamepad.Events.BUTTON_UP, onButtonUp, this);
}

function onKeyDown(this: NormalizedInputPlugin, event: KeyboardEvent) {
  onKey.call(this, event, true);
}

function onKeyUp(this: NormalizedInputPlugin, event: KeyboardEvent) {
  onKey.call(this, event, false);
}

function onKey(this: NormalizedInputPlugin, event: KeyboardEvent, pressed: boolean) {
  currentDevice = InputDevice.Keyboard;

  const code = event.code;

  if (!deviceInputEdges[currentDevice][code]) {
    deviceInputEdges[currentDevice][code] = { pressed, timestamp: this.scene.time.now };

    if (process.env.NODE_ENV === 'development') {
      console.debug(event, deviceInputEdges[currentDevice][code]);
    }

    return;
  }

  if (!deviceInputEdges[currentDevice][code].pressed) {
    deviceInputEdges[currentDevice][code].pressed = pressed;
    deviceInputEdges[currentDevice][code].timestamp = this.scene.time.now;

    if (process.env.NODE_ENV === 'development') {
      console.debug(event, deviceInputEdges[currentDevice][code]);
    }
  }
}

function onButtonDown(
  this: NormalizedInputPlugin,
  gamepad: Phaser.Input.Gamepad.Gamepad,
  button: Phaser.Input.Gamepad.Button
) {
  onButton.call(this, gamepad, button, true);
}

function onButtonUp(
  this: NormalizedInputPlugin,
  gamepad: Phaser.Input.Gamepad.Gamepad,
  button: Phaser.Input.Gamepad.Button
) {
  onButton.call(this, gamepad, button, false);
}

function onButton(
  this: NormalizedInputPlugin,
  gamepad: Phaser.Input.Gamepad.Gamepad,
  button: Phaser.Input.Gamepad.Button,
  pressed: boolean
) {
  currentDevice = InputDevice.Gamepad;

  const index = button.index as GamepadInput;

  if (!deviceInputEdges[currentDevice][index]) {
    deviceInputEdges[currentDevice][index] = { pressed, timestamp: this.scene.time.now };

    if (process.env.NODE_ENV === 'development') {
      console.debug(gamepad, button, deviceInputEdges[currentDevice][index]);
    }

    return;
  }

  if (!deviceInputEdges[currentDevice][index].pressed) {
    deviceInputEdges[currentDevice][index].pressed = pressed;
    deviceInputEdges[currentDevice][index].timestamp = this.scene.time.now;

    if (process.env.NODE_ENV === 'development') {
      console.debug(gamepad, button, deviceInputEdges[currentDevice][index]);
    }
  }
}
