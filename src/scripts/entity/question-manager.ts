module Hrj.Entity {
    export class QuestionManager extends Phaser.Group {
        data: any;

        constructor(game) {
            super(game, null, 'qm', true);

            this.data = game.load.json('questions');

        }

    }
}
