/// <reference path="../refs.d.ts" />

module Hrj {
    export class Game extends Phaser.Game {
        static WIDTH: number = 720;
        static HEIGHT: number = 1280;

        constructor() {
            super({
                width: Game.WIDTH,
                height: Game.HEIGHT,
                renderer: Phaser.AUTO
            });

            this.state.add('boot', State.Boot, true);
            this.state.add('preloader', State.Preloader);
            this.state.add('title', State.Title);
            this.state.add('game', State.Game);
            this.state.add('end', State.End);
        }

        boot() {
            super.boot();
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.setMinMax(0, 0, Game.WIDTH, Game.HEIGHT);
        }
    }
}

// export Game to window
var Game = Hrj.Game;

