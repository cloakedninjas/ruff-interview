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

        music: Phaser.Sound;

        create() {
            this.add.sprite(0, 0, 'game-bg');

            this.dog = new Entity.Dog(this.game);
            this.add.existing(this.dog);
            this.dog.grabbedBiscuit.add(this.removeBiscuit, this);
            this.dog.fallOver.add(this.handleFallOver, this);

            this.table = this.add.sprite(0, 889, 'table');
            this.interviewer = this.add.sprite(-120, 578, 'interviewer');

            this.table.x = -this.table.width;
            this.interviewer.x = -this.interviewer.width - 20;
            this.interviewer.y = this.game.height;

            this.questionManager = new Entity.QuestionManager(this.game, this.dog);
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

            this.music = this.add.audio('game-music', 1, true);

            this.playIntro();
            this.beginInterview();

            window['state'] = this;
        }

        playIntro() {
            this.music.play();

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

            if (this.biscuits.length === 0) {

                this.game.time.events.add(1000, () => {
                    this.questionManager.interviewerSpeak('Whoa, whoa whoa ... where did all the biscuits go?');
                    this.handleGameOver(false);
                });
            }
        }

        handleFallOver() {
            this.questionManager.interviewerSpeak('What the heck? You were dogs?!');
            this.game.time.events.add(2000, () => {
                this.questionManager.interviewerSpeak('I\'m not even mad, that\'s amazing');
            });
            this.handleGameOver(false);
        }

        handleQuestionAnswer() {
            this.result.frameName = 'paper-' + this.questionManager.correctCount;
        }

        handleGameOver(success: boolean) {
            this.dog.stopAll();
            this.questionManager.clearThoughtBubbles();

            if (success) {
                console.log('Win');
            } else {
                console.log('Loss');
            }
        }
    }
}
