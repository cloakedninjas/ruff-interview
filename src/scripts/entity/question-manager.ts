module Hrj.Entity {
    export class QuestionManager extends Phaser.Group {
        data: any;
        bubble: Phaser.Sprite;
        questionText: Phaser.Text;
        buttons: Phaser.Button[];

        constructor(game) {
            super(game, null, 'qm', true);

            //this.data = game.load.json('questions');
            this.bubble = new Phaser.Sprite(game, 10, 206, 'speech-bubble');
            this.bubble.visible = false;
            this.add(this.bubble);

            const padding = 20;

            this.questionText = new Phaser.Text(game, this.bubble.x + padding, this.bubble.y + padding, '', {
                font: "28px Arial",
                fill: "#000",
                align: "left",
                boundsAlignH: "left",
                boundsAlignV: "top",
                wordWrap: true,
                wordWrapWidth: this.bubble.width - (padding * 2)
            });

            this.add(this.questionText);

            this.buttons = [];

            for (let i = 0; i < 3; i++) {
                let x = (i * 230) + 20;
                let button = new Phaser.Button(game, x, 10, 'thought-bubble');
                button.visible = false;
                this.buttons.push(button);
                this.add(button);
            }
        }

        askQuestion() {
            this.bubble.visible = true;
            const text = 'What would you do if you saw a stick on the road?';
            const words = text.split(' ');
            const delay = 100;
            let i = 0;

            let timer = this.game.time.create();
            timer.loop(delay, () => {
                if (words[i] === undefined) {
                    timer.stop();
                    return;
                }

                this.printNextWord(words[i]);
                i++;
            });

            timer.start();
            timer.onComplete.add(this.showButtons, this);
        }

        printNextWord(newWord: string) {
            this.questionText.setText(this.questionText.text + ' ' + newWord);
        }

        showButtons() {
            this.buttons.forEach((button) => {

                button.visible = true;
            });
        }
    }
}
