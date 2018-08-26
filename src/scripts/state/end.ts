module Hrj.State {
    export class End extends Phaser.State {

        success: boolean;
        failCond: string;

        init(success: boolean, failCond: string) {
            this.success = success;
            this.failCond = failCond;
        }

        create() {
            const bg = this.success ? 'bg-title' : 'bg-end-fail';
            this.add.sprite(0, 0, bg);

            const btn = this.game.add.button(0, 0, 'main-menu', this.restart, this);
            btn.visible = false;

            if (this.success) {
                this.animSuccess(btn);
                this.game.add.audio('game_over_success').play();
            } else {
                this.game.add.audio('game_over_fail').play();
                if (this.failCond !== 'biscuits') {
                    this.game.add.sprite(193, 370, 'end-table-cookie');
                    this.game.add.sprite(50, 869, 'end-dog-3');
                } else {
                    this.game.add.sprite(50, 869, 'end-dog-3-cookie');
                }

                this.game.time.events.add(1500, () => {
                    btn.x = 410;
                    btn.y = 1140;
                    btn.visible = true;
                    btn.bringToTop();
                });
            }
        }

        restart() {
            this.game.state.start('title', true);
        }

        animSuccess(btn: Phaser.Button) {
            const dogRight = this.game.add.sprite(720, 120, 'end-dog-right');
            const dogLeft = this.game.add.sprite(0, -700, 'end-dog-left');

            const offer = this.game.add.sprite(360, 2080, 'job-offer');
            offer.anchor.set(0.5, 1);

            this.game.tweens.create(offer).to({
                y: this.game.height
            }, 1000, Phaser.Easing.Exponential.Out, true, 1000);

            this.game.tweens.create(dogRight).to({
                x: 400
            }, 1000, Phaser.Easing.Exponential.Out, true, 2000);

            this.game.tweens.create(dogLeft).to({
                y: 130
            }, 600, Phaser.Easing.Exponential.In, true, 3000);

            this.game.time.events.add(4000, () => {
                btn.x = 220;
                btn.y = 950;
                btn.visible = true;
                btn.bringToTop();
            });
        }
    }
}
