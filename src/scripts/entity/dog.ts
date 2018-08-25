module Hrj.Entity {
    export class Dog extends Phaser.Sprite {
        head: Phaser.Sprite;
        hand: Phaser.Sprite;
        trenchRight: Phaser.Sprite;

        handTween: Phaser.Tween;

        constructor(game) {
            super(game, 500, game.height, 'trench-left');
            this.anchor.set(0.5, 1);

            this.hand = new Phaser.Sprite(game, -50, -510, 'dog-arm');
            this.addChild(this.hand);

            this.trenchRight = new Phaser.Sprite(game, 67, -107, 'trench-right');
            this.trenchRight.anchor.set(0.5, 1);
            this.addChild(this.trenchRight);

            this.head = new Phaser.Sprite(game, -10, -688, 'dog-head');
            this.head.anchor.set(0.5, 1);
            this.addChild(this.head);

            window['dog'] = this;
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
            }, 500, Phaser.Easing.Circular.Out, true);
        }
    }
}
