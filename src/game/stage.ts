/**
 * @file Implements the scenes entrypoint within the game.
 * @author Tristan Bonsor <kidthales@agogpixel.com>
 * @copyright 2025 Tristan Bonsor <https://www.gnu.org/licenses/agpl-3.0.txt>
 */

import Splash from './dom/splash';

export default class Stage extends Phaser.Scene {
  static get scenes() {
    return [Stage];
  }

  private readonly _splash = new Splash(this);

  preload() {
    this.load.json('manifest', 'assets/manifest.json').once(
      Phaser.Loader.Events.FILE_COMPLETE,
      function (this: Stage) {
        this._splash.run(1000, 2000);
        return this.load.addPack(this.cache.json.get('manifest'), 'core');
      },
      this
    );
  }
}
