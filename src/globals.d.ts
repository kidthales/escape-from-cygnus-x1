export {};

declare global {
  const VERSION: string;

  interface Window {
    Game: Phaser.Game;
  }
}
