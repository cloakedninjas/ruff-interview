module Hrj.State {
    export class Game extends Phaser.State {
        dog: Entity.Dog;
        questionManager: Entity.QuestionManager;
        table: Phaser.Sprite;
        interviewer: Phaser.Sprite;

        bowl: Phaser.Sprite;
        bowlFront: Phaser.Sprite;

        create() {
            this.dog = new Entity.Dog(this.game);
            this.add.existing(this.dog);

            this.table = this.add.sprite(0, 889, 'table');
            this.interviewer = this.add.sprite(-120, 578, 'interviewer');

            this.table.x = -this.table.width;
            this.interviewer.x = -this.interviewer.width;
            this.interviewer.y = this.game.height;

            this.questionManager = new Entity.QuestionManager(this.game);
            this.add.existing(this.questionManager);

            this.playIntro();

            window['state'] = this;
        }

        playIntro() {
            const tableTween = this.game.tweens.create(this.table).to({
                x: 0
            }, 1000, Phaser.Easing.Exponential.InOut, true, 1000);

            tableTween.onComplete.add(function () {
                const intTween = this.game.tweens.create(this.interviewer).to({
                    x: -120,
                    y: 578
                }, 2000, Phaser.Easing.Quintic.Out, true, 1000);

                intTween.onComplete.add(this.beginInterview, this);
            }.bind(this));
        }

        beginInterview() {
            this.dog.idleWobble();
            this.questionManager.askQuestion();
        }
    }
}
