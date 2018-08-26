module Hrj.Entity {
    export class Dog extends Phaser.Sprite {
        private static GRAB_MIN_DELAY: number = 3000;
        private static GRAB_MAX_DELAY: number = 4000;
        private static GRAB_GRACE_DELAY: number = 3000;

        private static IDLE_WOBBLE_ANGLE: number = 3;
        private static FULL_WOBBLE_ANGLE: number = 60;
        private static WOBBLE_TIP_CHANCE: number = 1; // TODO change

        head: Phaser.Sprite;
        hand: Phaser.Sprite;
        trenchRight: Phaser.Sprite;
        footLeft: Phaser.Sprite;
        footRight: Phaser.Sprite;

        handTween: Phaser.Tween;
        grabTimer: Phaser.TimerEvent;

        fallBodyTween: Phaser.Tween;
        fallFootTween: Phaser.Tween;

        grabbedBiscuit: Phaser.Signal;
        fallOver: Phaser.Signal;

        constructor(game) {
            super(game, 540, game.height, 'trench-left');
            this.anchor.set(0.5, 1);

            this.hand = new Phaser.Sprite(game, -50, -510, 'dog-arm');
            this.hand.events.onInputDown.add(this.retractHand, this);
            this.addChild(this.hand);

            this.footLeft = new Phaser.Sprite(game, -50, 0, 'dog-foot');
            this.footLeft.anchor.set(0.5, 1);
            this.addChild(this.footLeft);

            this.footRight = new Phaser.Sprite(game, 40, -112, 'dog-foot');
            this.footRight.anchor.set(0.5, 0);
            this.addChild(this.footRight);

            this.trenchRight = new Phaser.Sprite(game, 0, 0, 'trench-right');
            this.trenchRight.anchor.set(0.5, 1);
            this.addChild(this.trenchRight);

            this.head = new Phaser.Sprite(game, 0, -688, 'dog-head');
            this.head.anchor.set(0.5, 1);
            this.addChild(this.head);

            this.grabbedBiscuit = new Phaser.Signal();
            this.fallOver = new Phaser.Signal();

            window['dog'] = this;
        }

        activate() {
            this.idleWobble();
            this.beginReaching();
        }

        beginReaching() {
            const delay = Phaser.Math.random(Dog.GRAB_MIN_DELAY, Dog.GRAB_MAX_DELAY);
            this.grabTimer = this.game.time.events.add(delay, this.reachOut, this);
        }

        reachOut() {
            this.hand.inputEnabled = true;
            this.handTween = this.game.tweens.create(this.hand.position).to({
                x: -190
            }, 2000, Phaser.Easing.Linear.None, true);

            this.handTween.onComplete.add(() => {
                this.grabTimer = this.game.time.events.add(500, this.grabBiscuit, this);
            });
        }

        retractHand() {
            this.handTween.stop(false);
            this.game.time.events.remove(this.grabTimer);

            this.game.tweens.create(this.hand.position).to({
                x: -50
            }, 500, Phaser.Easing.Quadratic.InOut, true);

            this.beginReaching();
        }

        grabBiscuit() {
            this.hand.inputEnabled = false;
            this.grabbedBiscuit.dispatch();
            this.hand.loadTexture('dog-arm-2');

            this.handTween = this.game.tweens.create(this.hand.position).to({
                x: -77
            }, 800, Phaser.Easing.Quadratic.InOut, true);

            this.handTween.onComplete.add(() => {
                this.hand.loadTexture('dog-arm');
                this.hand.x = -50;

                this.grabTimer = this.game.time.events.add(Dog.GRAB_GRACE_DELAY, this.beginReaching, this);
            });
        }

        idleWobble() {
            const easing = Phaser.Easing.Sinusoidal.InOut;
            let duration = 3000;

            let tweenRight = this.game.tweens.create(this).to({
                angle: Dog.IDLE_WOBBLE_ANGLE
            }, duration, easing, true);

            tweenRight.onComplete.addOnce(function () {
                tweenRight.updateTweenData('duration', duration * 2);
            });

            tweenRight.onComplete.add(() => {
                // will a full wobble occur?
                if (Math.random() <= Dog.WOBBLE_TIP_CHANCE) {
                    this.beginFall();
                } else {
                    let tweenLeft = this.game.tweens.create(this).to({
                        angle: -Dog.IDLE_WOBBLE_ANGLE
                    }, duration * 2, easing, true);

                    tweenLeft.onComplete.add(() => {
                        tweenRight.start();
                    });
                }
            });
        }

        beginFall() {
            this.footRight.inputEnabled = true;
            this.fallBodyTween = this.game.tweens.create(this).to({
                angle: -Dog.FULL_WOBBLE_ANGLE
            }, 7000, Phaser.Easing.Exponential.In, true);

            this.fallFootTween = this.game.tweens.create(this.footRight).to({
                angle: -25
            }, 4000, Phaser.Easing.Quadratic.In, true, 3000);

            this.fallBodyTween.onComplete.add(() => {
                this.footRight.inputEnabled = false;
                this.fallOver.dispatch();
            });

            this.footRight.events.onInputDown.add(this.correctFall, this);
        }

        correctFall() {
            this.footRight.inputEnabled = false;

            this.fallBodyTween.stop(false);
            this.fallFootTween.stop(false);

            const tween = this.game.tweens.create(this).to({
                angle: 0
            }, 800, Phaser.Easing.Back.Out, true);

            this.game.tweens.create(this.footRight).to({
                angle: 0
            }, 300, Phaser.Easing.Exponential.In, true);

            // queue wobble idle

            tween.onComplete.add(() => {
                this.game.time.events.add(Dog.GRAB_GRACE_DELAY, this.idleWobble, this);
            });
        }

        stopAll() {
            this.hand.inputEnabled = false;
            this.game.time.events.remove(this.grabTimer);
            this.handTween.stop(false);
        }
    }
}
