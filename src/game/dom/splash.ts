/**
 * @file Implements splash preload & fade out behavior.
 * @author Tristan Bonsor <kidthales@agogpixel.com>
 * @copyright 2025 Tristan Bonsor <https://www.gnu.org/licenses/agpl-3.0.txt>
 */

export default class Splash {
  constructor(private readonly _scene: Phaser.Scene) {}

  private get splash() {
    return document.getElementById('splash') as HTMLDivElement;
  }

  private get preloadProgress() {
    return document.getElementById('preloadProgress') as HTMLProgressElement;
  }

  private get preloadText() {
    return document.getElementById('preloadText') as HTMLElement;
  }

  run(fadeOutDuration: number = 1000, fadeOutDelay: number = 0) {
    const splash = this.splash;
    splash.style.display = 'flex';
    splash.style.opacity = '1';

    const preloadProgress = this.preloadProgress;
    preloadProgress.value = 0;
    preloadProgress.max = 100;

    const listener = function (this: Splash, progress: number) {
      return this.onLoaderProgress(progress, fadeOutDuration, fadeOutDelay, listener);
    };

    this._scene.load.on(Phaser.Loader.Events.PROGRESS, listener, this);
  }

  private onLoaderProgress(
    progress: number,
    fadeOutDuration: number,
    fadeOutDelay: number,
    listener: (progress: number) => void
  ) {
    this.preloadProgress.value = Math.floor(progress * 100);
    this.preloadText.innerText = this.preloadProgress.value + '%';

    if (progress === 1) {
      this.fadeOut(fadeOutDuration, fadeOutDelay, listener);
    }
  }

  private fadeOut(duration: number, delay: number, listener: (progress: number) => void) {
    let startTime: number | undefined;

    const fade = (timestamp: number) => {
      if (startTime === undefined) {
        startTime = timestamp;
      }

      const opacity = Phaser.Math.Clamp(1 - (timestamp - startTime) / duration, 0, 1);

      const splash = this.splash;
      splash.style.opacity = `${opacity}`;

      if (opacity === 0) {
        splash.style.display = 'none';
        this._scene.load.off(Phaser.Loader.Events.PROGRESS, listener);
        return;
      }

      requestAnimationFrame((timestamp) => fade(timestamp));
    };

    setTimeout(() => requestAnimationFrame((timestamp) => fade(timestamp)), delay);
  }
}
