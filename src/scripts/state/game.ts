module Hrj.State {
    export class Game extends Phaser.State {
        dog: Entity.Dog;
        questionManager: Entity.QuestionManager;

        create() {
            this.dog = new Entity.Dog(this.game);
            this.add.existing(this.dog);

            this.questionManager = new Entity.QuestionManager(this.game);
            this.add.existing(this.questionManager);

            this.dog.idleWobble();

            this.add.sprite(0, 889, 'table');
            this.add.sprite(-120, 578, 'interviewer');

        }
    }
}
