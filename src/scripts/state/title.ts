module Hrj.State {
    export class Title extends Phaser.State {

        preload() {

        }

        create() {
            this.add.sprite(0, 0, 'bg-title');

            const logo = this.add.sprite(this.game.world.centerX, 100, 'title');
            logo.anchor.set(0.5, 0.5);

            const dog1 = this.add.sprite(10700, 1260, 'title-dog1');
            dog1.anchor.set(0.5, 1);

            const playButton = this.add.button(this.game.world.centerX, 1360, 'btn-play', this.startGame, this);
            playButton.anchor.set(0.5, 0.5);

            const easing = Phaser.Easing.Quintic.InOut;

            this.game.tweens.create(dog1).to({
                x: this.game.world.centerX
            }, 800, easing, true, 1000);

            this.game.tweens.create(playButton).to({
                y: 1100
            }, 800, easing, true, 2000);

        }

        startGame() {
            this.game.state.start('game', true);
        }
    }
}
