/**
 * @file Implements the application execution entrypoint.
 * @author Tristan Bonsor <kidthales@agogpixel.com>
 * @copyright 2025 Tristan Bonsor <https://www.gnu.org/licenses/agpl-3.0.txt>
 */

import 'phaser';

if (process.env.NODE_ENV === 'development') {
  // TODO
}

const width = 640;
const height = 360;
const snapWidth = 320;
const snapHeight = 180;

// TODO
window.Game = new Phaser.Game({
  type: Phaser.WEBGL,
  parent: 'gameContainer',
  dom: { createContainer: true },
  transparent: true,
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width,
    height,
    min: { width, height },
    snap: { width: snapWidth, height: snapHeight }
  }
});
