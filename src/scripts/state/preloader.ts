module Hrj.State {
    export class Preloader extends Phaser.State {
        loadingBar:Entity.PreloadBar;

        preload() {
            this.loadingBar = new Entity.PreloadBar(this.game);
            this.load.image('bg', 'assets/images/background.png');

            this.load.image('trench-left', 'assets/images/trench-left.png');
            this.load.image('dog-head', 'assets/images/dog-face.png');
            this.load.image('dog-arm', 'assets/images/dog-arm.png');
            this.load.image('dog-foot', 'assets/images/dog-foot.png');
            this.load.image('trench-right', 'assets/images/trench-right.png');

            this.load.image('table', 'assets/images/table.png');
            this.load.image('bowl-back', 'assets/images/bowl-back.png');
            this.load.image('bowl-front', 'assets/images/bowl-front.png');
            this.load.image('biscuit', 'assets/images/biscuit.png');

            this.load.image('interviewer', 'assets/images/interviewer.png');
            this.load.image('speech-bubble', 'assets/images/speech.png');
            this.load.image('thought-bubble', 'assets/images/bubble.png');

            this.load.json('questions', 'assets/questions.json');
        }

        create() {
            this.loadingBar.setFillPercent(100);
            const tween = this.game.add.tween(this.loadingBar).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startGame, this);
        }

        startGame() {
            this.game.state.start('game', true);
        }

        loadUpdate() {
            this.loadingBar.setFillPercent(this.load.progress);
        }
    }
}
