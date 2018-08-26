module Hrj.State {
    export class End extends Phaser.State {

        success: boolean;
        failCond: string;

        preload() {
            this.game.load.image('endscreen-2', 'assets/images/endscreen-2.png');
        }

        init(success: boolean, failCond: string) {
            this.success = success;
            this.failCond = failCond;

            console.log(arguments);
        }

        create() {
            if (this.success) {
                this.add.sprite(0, 0, 'bg-title');
            } else {
                this.add.sprite(0, 0, 'endscreen-2');
            }
        }
    }
}
