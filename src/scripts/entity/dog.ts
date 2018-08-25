module Hrj.Entity {
    export class Dog extends Phaser.Sprite {
        head: Phaser.Sprite;
        hand: Phaser.Sprite;
        trenchRight: Phaser.Sprite;
        footLeft: Phaser.Sprite;
        footRight: Phaser.Sprite;

        handTween: Phaser.Tween;

        constructor(game) {
            super(game, 540, game.height, 'trench-left');
            this.anchor.set(0.5, 1);

            this.hand = new Phaser.Sprite(game, -50, -510, 'dog-arm');
            this.hand.inputEnabled = true;
            this.hand.events.onInputDown.add(this.retractHand, this);
            this.addChild(this.hand);

            this.footLeft = new Phaser.Sprite(game, -50, 0, 'dog-foot');
            this.footLeft.anchor.set(0.5, 1);
            this.addChild(this.footLeft);

            this.footRight = new Phaser.Sprite(game, 40, 0, 'dog-foot');
            this.footRight.anchor.set(0.5, 1);
            this.addChild(this.footRight);

            this.trenchRight = new Phaser.Sprite(game, 0, 0, 'trench-right');
            this.trenchRight.anchor.set(0.5, 1);
            this.addChild(this.trenchRight);

            this.head = new Phaser.Sprite(game, 0, -688, 'dog-head');
            this.head.anchor.set(0.5, 1);
            this.addChild(this.head);

            window['dog'] = this;
        }

        activate() {
            this.idleWobble();
            this.beginReaching();
        }

        beginReaching() {
            const delay = Phaser.Math.random(4000, 9000);

            const timer = this.game.time.create();
            timer.add(delay, this.reachOut, this);
            timer.start();
        }

        reachOut() {
            this.handTween = this.game.tweens.create(this.hand.position).to({
                x: -190
            }, 2000, Phaser.Easing.Linear.None, true);
        }

        retractHand() {
            this.handTween.stop(false);
            this.game.tweens.create(this.hand.position).to({
                x: -50
            }, 500, Phaser.Easing.Quadratic.InOut, true);

            this.beginReaching();
        }

        idleWobble() {
            const easing = Phaser.Easing.Linear.None;
            const angle = 5;
            let duration = 3000;

            let tweenRight = this.game.tweens.create(this).to({
                angle: angle
            }, duration, easing, true, 0, 0);

            let footRightRight = this.game.tweens.create(this.footRight).to({
                angle: -angle
            }, duration, easing, true, 0, 0);

            tweenRight.onComplete.addOnce(function () {
                tweenRight.updateTweenData('duration', duration * 2);
                footRightRight.updateTweenData('duration', duration * 2);
            });

            tweenRight.onComplete.add(function () {
                let tweenLeft = this.game.tweens.create(this).to({
                    angle: -angle
                }, duration * 2, easing, true, 0, 0);

                this.game.tweens.create(this.footRight).to({
                    angle: angle
                }, duration, easing, true, 0, 0);

                tweenLeft.onComplete.add(function () {
                    tweenRight.start();
                    footRightRight.start();
                });


            }.bind(this));

        }
    }
}
