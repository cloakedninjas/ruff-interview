module Hrj.State {
    export class Title extends Phaser.State {

        music: Phaser.Sound;

        create() {
            this.add.sprite(0, 0, 'bg-title');

            const logo = this.add.sprite(this.game.world.centerX, 100, 'title');
            logo.anchor.set(0.5, 0.5);

            const leftDog = this.add.sprite(-362, 170, 'title-dog-left');
            const rightDog = this.add.sprite(1300, 320, 'title-dog-right');

            const dog1 = this.add.sprite(1600, 1260, 'title-dog1');
            dog1.anchor.set(0.5, 1);

            const playButton = this.add.button(this.game.world.centerX, 1360, 'btn-play', this.startGame, this);
            playButton.anchor.set(0.5, 0.5);

            const easing = Phaser.Easing.Quartic.InOut;
            const duration = 1000;

            this.game.tweens.create(leftDog).to({
                x: 10
            }, duration, easing, true, 1000);

            this.game.tweens.create(rightDog).to({
                x: 440
            }, duration, easing, true, 1000);

            this.game.tweens.create(dog1).to({
                x: this.game.world.centerX
            }, duration, easing, true, 1000);

            this.game.tweens.create(playButton).to({
                y: 1100
            }, 800, easing, true, 3000);

            this.music = this.add.audio('title-music');
            this.music.fadeIn(1000);
        }

        startGame() {
            this.game.add.audio('selection').play();
            this.game.state.start('game', true);
        }

        shutdown() {
            this.music.stop();
        }
    }
}
