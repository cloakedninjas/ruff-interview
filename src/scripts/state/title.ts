module Hrj.State {
    export class Title extends Phaser.State {

        music: Phaser.Sound;

        preload() {
            this.load.audio('interviewer_talking_1', 'assets/audio/sfx/interviewer_talking_1.mp3');
            this.load.audio('interviewer_talking_2', 'assets/audio/sfx/interviewer_talking_2.mp3');
            this.load.audio('interviewer_talking_3', 'assets/audio/sfx/interviewer_talking_3.mp3');

            this.load.audio('dog_talk_correct_1', 'assets/audio/sfx/dog_talk_correct_1.mp3');
            this.load.audio('dog_talk_correct_2', 'assets/audio/sfx/dog_talk_correct_2.mp3');
            this.load.audio('dog_talk_correct_3', 'assets/audio/sfx/dog_talk_correct_3.mp3');
            this.load.audio('dog_talk_wrong_1', 'assets/audio/sfx/dog_talk_wrong_1.mp3');
            this.load.audio('dog_talk_wrong_2', 'assets/audio/sfx/dog_talk_wrong_2.mp3');
            this.load.audio('dog_talk_wrong_3', 'assets/audio/sfx/dog_talk_wrong_3.mp3');

            this.load.audio('paw_stretch', 'assets/audio/sfx/paw_stretch.mp3');
            this.load.audio('slap_paw', 'assets/audio/sfx/slap_paw.mp3');
            this.load.audio('yoink_retreat', 'assets/audio/sfx/yoink_retreat.mp3');
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
