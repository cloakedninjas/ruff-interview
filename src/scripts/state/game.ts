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

        sfx: any;

        create() {
            this.add.sprite(0, 0, 'bg-game');

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
            this.questionManager.gameOver.addOnce(this.handleGameOver, this, null, false, 'errors');
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

            this.music = this.add.audio('game-music');
            this.sfx = {

            };

            this.playIntro();

            window['state'] = this;
        }

        playIntro() {
            this.music.fadeIn(1000, true);

            const tableTween = this.game.tweens.create(this.table).to({
                x: 0
            }, 1000, Phaser.Easing.Exponential.InOut, true, 1000);

            tableTween.onComplete.add(() => {
                const intTween = this.game.tweens.create(this.interviewer).to({
                    x: -120,
                    y: 578
                }, 2000, Phaser.Easing.Quintic.Out, true, 1000);

                intTween.onComplete.add(this.beginInterview, this);
            });
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
                    this.handleGameOver(false, 'biscuits');
                });
            }
        }

        handleFallOver() {
            this.questionManager.interviewerSpeak('What the heck? You were dogs?!');
            this.game.time.events.add(2000, () => {
                this.questionManager.interviewerSpeak('I\'m not even mad, that\'s amazing');

                this.game.time.events.add(2000, () => {
                    this.handleGameOver(false, 'fell');
                });
            });
        }

        handleQuestionAnswer() {
            this.result.frameName = 'paper-' + this.questionManager.correctCount;
        }

        handleGameOver(success: boolean, failCond: string) {
            this.dog.stopAll();
            this.questionManager.clearThoughtBubbles();

            this.game.state.start('end', true, false, success, failCond);
        }

        shutdown() {
            this.music.stop();
        }
    }
}
