module Hrj.State {
    export class Preloader extends Phaser.State {
        loadingBar:Entity.PreloadBar;

        preload() {
            const logo = this.add.sprite(this.game.world.centerX, 100, 'title');
            logo.anchor.set(0.5, 0.5);

            this.loadingBar = new Entity.PreloadBar(this.game);
            this.load.image('bg-title', 'assets/images/bg-title.png');
            this.load.image('bg-game', 'assets/images/bg-game.png');

            this.load.image('title-dog1', 'assets/images/title-dog1.png');
            this.load.image('btn-play', 'assets/images/play.png');

            this.load.image('trench-left', 'assets/images/trench-left.png');
            this.load.image('dog-arm', 'assets/images/dog-arm.png');
            this.load.image('dog-arm-2', 'assets/images/dog-arm-2.png');
            this.load.image('dog-foot', 'assets/images/dog-foot.png');
            this.load.image('trench-right', 'assets/images/trench-right.png');

            this.load.image('table', 'assets/images/table.png');
            this.load.image('bowl-back', 'assets/images/bowl-back.png');
            this.load.image('bowl-front', 'assets/images/bowl-front.png');
            this.load.image('biscuit', 'assets/images/biscuit.png');

            this.load.image('interviewer', 'assets/images/interviewer.png');
            this.load.image('speech-bubble', 'assets/images/speech.png');
            this.load.image('thought-bubble', 'assets/images/bubble.png');

            this.load.image('thought-bubble-1', 'assets/images/thought-1.png');
            this.load.image('thought-bubble-2', 'assets/images/thought-2.png');

            this.load.atlasJSONHash('result', 'assets/spritesheets/result.png', 'assets/spritesheets/result.json');
            this.load.atlasJSONHash('dog', 'assets/spritesheets/dog.png', 'assets/spritesheets/dog.json');

            this.load.json('questions', 'assets/questions.json');

            this.load.audio('title-music', 'assets/audio/music/title.mp3');
            this.load.audio('game-music', 'assets/audio/music/game.mp3');
            this.load.audio('selection', 'assets/audio/sfx/selection.mp3');
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
            this.load.audio('fall_over', 'assets/audio/sfx/fall_over.mp3');

            this.load.audio('bubble_1', 'assets/audio/sfx/bubble_1.mp3');
            this.load.audio('bubble_2', 'assets/audio/sfx/bubble_2.mp3');
            this.load.audio('bubble_3', 'assets/audio/sfx/bubble_3.mp3');
        }

        create() {
            this.loadingBar.setFillPercent(100);
            const tween = this.game.add.tween(this.loadingBar).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startGame, this);
        }

        startGame() {
            this.game.state.start('title', true);
        }

        loadUpdate() {
            this.loadingBar.setFillPercent(this.load.progress);
        }
    }
}
