module Hrj.State {
    export class Game extends Phaser.State {
        dog: Entity.Dog;
        questionManager: Entity.QuestionManager;
        table: Phaser.Sprite;
        interviewer: Phaser.Sprite;

        bowl: Phaser.Sprite;
        bowlFront: Phaser.Sprite;
        biscuits: Phaser.Sprite[];

        result: Phaser.Sprite;

        create() {
            this.add.sprite(0, 0, 'bg');

            this.dog = new Entity.Dog(this.game);
            this.add.existing(this.dog);

            this.table = this.add.sprite(0, 889, 'table');
            this.interviewer = this.add.sprite(-120, 578, 'interviewer');

            this.table.x = -this.table.width;
            this.interviewer.x = -this.interviewer.width - 20;
            this.interviewer.y = this.game.height;

            this.questionManager = new Entity.QuestionManager(this.game);
            this.add.existing(this.questionManager);
            this.questionManager.gameOver.addOnce(this.handleGameOver, this);
            this.questionManager.questionAnswered.add(this.handleQuestionAnswer, this);

            this.bowl = new Phaser.Sprite(this.game, 320, 10, 'bowl-back');
            this.bowlFront = new Phaser.Sprite(this.game, 320, 10, 'bowl-front');
            this.table.addChild(this.bowl);

            this.biscuits = [
                new Phaser.Sprite(this.game, 330, -5, 'biscuit'),
                new Phaser.Sprite(this.game, 410, 0, 'biscuit'),
                new Phaser.Sprite(this.game, 360, -6, 'biscuit')
            ];

            this.biscuits.forEach((biscuit) => {
               this.table.addChild(biscuit);
            });

            this.table.addChild(this.bowlFront);

            this.result = new Phaser.Sprite(this.game, 280, 100, 'result', 'paper-0');
            this.table.addChild(this.result);

            this.playIntro();
            this.beginInterview();

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

                // TODO uncomment
                // intTween.onComplete.add(this.beginInterview, this);
            }.bind(this));
        }

        beginInterview() {
            this.dog.activate();
            this.questionManager.begin();
        }

        removeBiscuit() {
            this.biscuits.pop().destroy();
        }

        handleQuestionAnswer() {
            this.result.frameName = 'paper-' + this.questionManager.correctCount;
        }

        handleGameOver(success: boolean) {
            if (success) {
                console.log('Win');
            } else {
                console.log('Loss');
            }
        }
    }
}
