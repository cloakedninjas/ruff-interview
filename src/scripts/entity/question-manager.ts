module Hrj.Entity {
    export class QuestionManager extends Phaser.Group {
        static MAX_WRONG: number = 3;
        static MAX_CORRECT: number = 10;
        static RESULT_FAIL: boolean = false;
        static RESULT_SUCCESS: boolean = true;
        private static B_RESULT_CORRECT: number = 1;
        private static B_RESULT_INCORRECT: number = 2;
        private static B_RESULT_WRONG: number = 3;

        data: any;
        intBubble: Phaser.Sprite;
        interviewerText: Phaser.Text;

        dogBubble: Phaser.Sprite;
        dogText: Phaser.Text;

        buttons: TextButton[];
        correctButton: TextButton;
        incorrectButton: TextButton;
        badButton: TextButton;

        wrongCount: number = 0;
        correctCount: number = 0;

        speakerDone: Phaser.Signal;
        gameOver: Phaser.Signal;


        constructor(game) {
            super(game, null, 'qm', true);

            this.data = game.cache.getJSON('questions');
            this.intBubble = new Phaser.Sprite(game, 10, 220, 'speech-bubble');
            this.intBubble.visible = false;
            this.add(this.intBubble);

            let width = 280;
            let padding = 20;
            let speechTextStyle = {
                font: '28px Arial',
                fill: '#000',
                align: 'center',
                boundsAlignH: 'center',
                boundsAlignV: 'middle',
                wordWrap: true,
                wordWrapWidth: width - (padding * 2)
            };
            let bubbleTextBox = {
                w: width - padding,
                h: width - padding - 30
            };

            this.interviewerText = new Phaser.Text(game, this.intBubble.x, this.intBubble.y, '', speechTextStyle);
            this.interviewerText.setTextBounds(0, 0, bubbleTextBox.w, bubbleTextBox.h);
            this.add(this.interviewerText);

            // dog speech bubble

            this.dogBubble = new Phaser.Sprite(game, 710, 50, 'speech-bubble');
            this.dogBubble.scale.x = -1;
            this.dogBubble.visible = false;
            this.add(this.dogBubble);

            this.dogText = new Phaser.Text(game, 440, this.dogBubble.y, '', speechTextStyle);
            this.dogText.setTextBounds(0, 0, bubbleTextBox.w, bubbleTextBox.h);
            this.add(this.dogText);

            // buttons

            this.buttons = [];

            const buttonStyle = {
                font: '20px Arial',
                fill: '#000',
                align: 'center',
                boundsAlignH: 'center',
                boundsAlignV: 'middle',
                wordWrap: true,
                wordWrapWidth: this.intBubble.width - (padding * 2)
            };

            padding = 10;

            for (let i = 0; i < 3; i++) {
                let x = (i * 230) + 20;
                let button = new TextButton(game, x, 10, 'thought-bubble');
                button.visible = false;
                this.buttons.push(button);
                this.add(button);

                let t = new Phaser.Text(game, 0, 0, '', buttonStyle);
                t.setTextBounds(padding, padding, button.width - padding, button.height - padding);
                button.addText(t);
                button.events.onInputDown.add(this.handleButtonPush, this);
            }

            this.speakerDone = new Phaser.Signal();
            this.gameOver = new Phaser.Signal();
        }

        begin() {
            Phaser.ArrayUtils.shuffle(this.data.questions);
            Phaser.ArrayUtils.shuffle(this.data.bad_answers);

            this.interviewerSpeak('Hello and welcome to BigCorp International');

            this.speakerDone.addOnce(() => {
                this.game.time.events.add(4000, this.askQuestion, this);
            });
        }

        interviewerSpeak(text: string) {
            this.personSpeak(false, text);
        }

        dogSpeak(text: string) {
            this.personSpeak(true, text);
        }

        personSpeak(dog: boolean, text: string) {
            let bubble;
            let textBox;

            if (dog) {
                bubble = this.dogBubble;
                textBox = this.dogText;
            } else {
                bubble = this.intBubble;
                textBox = this.interviewerText;
            }

            bubble.visible = true;
            textBox.setText('');

            const words = text.split(' ');
            const delay = 100;
            let i = 0;

            let timer = this.game.time.create();
            timer.loop(delay, () => {
                if (words[i] === undefined) {
                    timer.stop();
                    return;
                }

                this.printNextWord(textBox, words[i]);
                i++;
            });

            timer.onComplete.add(() => {
                this.speakerDone.dispatch();
            });
            timer.start();
        }

        printNextWord(textArea: Phaser.Text, newWord: string) {
            textArea.setText(textArea.text + ' ' + newWord);
        }

        hideSpeech(dog: boolean) {
            let bubble;
            let textBox;

            if (dog) {
                bubble = this.dogBubble;
                textBox = this.dogText;
            } else {
                bubble = this.intBubble;
                textBox = this.interviewerText;
            }

            bubble.visible = false;
            textBox.setText('');
        }

        askQuestion() {
            const q = this.data.questions.shift();

            this.interviewerSpeak('What would you do if you saw a stick on the road?');

            this.speakerDone.addOnce(() => {
                //this.showButtons('A', 'B', 'Barking at the mailman');
            });

            this.showButtons('A', 'B', 'Barking at the mailman');
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
            let buttonResult;

            if (button === this.correctButton) {
                buttonResult = QuestionManager.B_RESULT_CORRECT;
            } else if (button === this.incorrectButton) {
                buttonResult = QuestionManager.B_RESULT_INCORRECT;
            } else {
                buttonResult = QuestionManager.B_RESULT_WRONG;
            }

            let tween;
            this.buttons.forEach((button) => {
                tween = this.game.tweens.create(button).to({
                    alpha: 0
                }, 500, Phaser.Easing.Quadratic.In, true);
            });

            tween.onComplete.add(() => {
                // show response
                this.giveResponse(buttonResult);
            });

            if (buttonResult === QuestionManager.B_RESULT_CORRECT) {
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

        giveResponse(result: number) {
            this.hideSpeech(false);
            this.dogSpeak('I like to lick my balls');
        }
    }
}
