module Hrj.Entity {
    export class QuestionManager extends Phaser.Group {
        static MAX_WRONG: number = 3;
        static MAX_CORRECT: number = 10;
        static RESULT_FAIL: boolean = false;
        static RESULT_SUCCESS: boolean = true;

        data: any;
        bubble: Phaser.Sprite;
        questionText: Phaser.Text;

        buttons: TextButton[];
        correctButton: TextButton;
        incorrectButton: TextButton;
        badButton: TextButton;

        wrongCount: number = 0;
        correctCount: number = 0;
        gameOver: Phaser.Signal;


        constructor(game) {
            super(game, null, 'qm', true);

            //this.data = game.load.json('questions');
            this.bubble = new Phaser.Sprite(game, 10, 206, 'speech-bubble');
            this.bubble.visible = false;
            this.add(this.bubble);

            const padding = 20;

            this.questionText = new Phaser.Text(game, this.bubble.x + padding, this.bubble.y + padding, '', {
                font: '28px Arial',
                fill: '#000',
                align: 'left',
                boundsAlignH: 'left',
                boundsAlignV: 'top',
                wordWrap: true,
                wordWrapWidth: this.bubble.width - (padding * 2)
            });

            this.add(this.questionText);

            this.buttons = [];

            const buttonStyle = {
                font: '20px Arial',
                fill: '#000',
                align: 'center',
                boundsAlignH: 'center',
                boundsAlignV: 'middle',
                wordWrap: true,
                wordWrapWidth: this.bubble.width - (padding * 2)
            };

            for (let i = 0; i < 3; i++) {
                let x = (i * 230) + 20;
                let button = new TextButton(game, x, 10, 'thought-bubble');
                button.visible = false;
                this.buttons.push(button);
                this.add(button);

                let t = new Phaser.Text(game, 0, 0, '', buttonStyle);
                t.setTextBounds(0, 0, button.width, button.height);
                button.addText(t);
                button.events.onInputDown.add(this.handleButtonPush, this);
            }

            this.gameOver = new Phaser.Signal();
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
            //timer.onComplete.add(this.showButtons, this, null, 'A', 'B', 'C');

            this.showButtons('A', 'B', 'C');
        }

        printNextWord(newWord: string) {
            this.questionText.setText(this.questionText.text + ' ' + newWord);
        }

        showButtons(correctAnswer: string, incorrectAnswer: string, badAnswer: string) {
            Phaser.ArrayUtils.shuffle(this.buttons);

            this.correctButton = this.buttons[0];
            this.incorrectButton = this.buttons[1];
            this.badButton = this.buttons[2];

            this.correctButton.text.setText(correctAnswer);
            this.incorrectButton.text.setText(incorrectAnswer);
            this.badButton.text.setText(badAnswer);

            this.buttons.forEach((button) => {
                button.visible = true;
            });
        }

        handleButtonPush(button: TextButton) {
            if (button === this.correctButton) {
                this.correctCount++;

                if (this.correctCount === QuestionManager.MAX_CORRECT) {
                    this.gameOver.dispatch(QuestionManager.RESULT_SUCCESS);
                }
            } else {
                this.wrongCount++;

                if (this.wrongCount === QuestionManager.MAX_WRONG) {
                    this.gameOver.dispatch(QuestionManager.RESULT_FAIL);
                }
            }
        }
    }
}
