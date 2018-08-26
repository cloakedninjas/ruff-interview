module Hrj.Entity {
    export class QuestionManager extends Phaser.Group {
        static MAX_WRONG: number = 3;
        static MAX_CORRECT: number = 8;
        static RESULT_FAIL: boolean = false;
        static RESULT_SUCCESS: boolean = true;
        private static B_RESULT_CORRECT: number = 1;
        private static B_RESULT_INCORRECT: number = 2;
        private static B_RESULT_WRONG: number = 3;
        private static INT_VOICE_NORMAL: number = 1;
        private static INT_VOICE_IMPRESSED: number = 2;
        private static INT_VOICE_DISAPPOINT: number = 3;

        dog:Dog;
        data: any;
        intBubble: Phaser.Sprite;
        interviewerText: Phaser.Text;

        dogBubble: Phaser.Sprite;
        dogText: Phaser.Text;

        thoughtBubble1: Phaser.Sprite;
        thoughtBubble2: Phaser.Sprite;

        buttons: TextButton[];
        correctButton: TextButton;
        incorrectButton: TextButton;
        badButton: TextButton;

        correctAnswer: any;
        incorrectAnswer: any;
        wrongAnswer: any;

        wrongCount: number = 0;
        correctCount: number = 0;

        intSounds: Phaser.Sound[];
        dogSoundsCorrect: Phaser.Sound[];
        dogSoundsWrong: Phaser.Sound[];
        bubbleSounds: Phaser.Sound[];
        sfx: any;

        questionAnswered: Phaser.Signal;
        speakerDone: Phaser.Signal;
        gameOver: Phaser.Signal;

        constructor(game, dog:Dog) {
            super(game, null, 'qm', true);

            this.dog = dog;
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
                h: width - padding
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
                font: '24px Arial',
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

            // thought bubbles

            this.thoughtBubble1 = new Phaser.Sprite(game, 500, 260, 'thought-bubble-1');
            this.thoughtBubble2 = new Phaser.Sprite(game, 445, 200, 'thought-bubble-2');
            this.thoughtBubble1.visible = false;
            this.thoughtBubble2.visible = false;
            this.addChild(this.thoughtBubble1);
            this.addChild(this.thoughtBubble2);

            // sounds

            this.intSounds = [
              new Phaser.Sound(game, 'interviewer_talking_1'),
              new Phaser.Sound(game, 'interviewer_talking_2'),
              new Phaser.Sound(game, 'interviewer_talking_3')
            ];

            this.dogSoundsCorrect = [
                new Phaser.Sound(game, 'dog_talk_correct_1'),
                new Phaser.Sound(game, 'dog_talk_correct_2'),
                new Phaser.Sound(game, 'dog_talk_correct_3')
            ];

            this.dogSoundsWrong = [
                new Phaser.Sound(game, 'dog_talk_wrong_1'),
                new Phaser.Sound(game, 'dog_talk_wrong_2'),
                new Phaser.Sound(game, 'dog_talk_wrong_3')
            ];

            this.bubbleSounds = [
                new Phaser.Sound(game, 'bubble_1'),
                new Phaser.Sound(game, 'bubble_2'),
                new Phaser.Sound(game, 'bubble_3')
            ];

            this.sfx = {
                intImpressed: game.add.audio('interviewer_impressed'),
                intDisappoint: game.add.audio('interviewer_disappoint'),
                click: game.add.audio('selection')
            };

            // signals

            this.questionAnswered = new Phaser.Signal();
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

        interviewerSpeak(text: string, voice: number = QuestionManager.INT_VOICE_NORMAL) {
            this.personSpeak(false, text);

            if (voice === QuestionManager.INT_VOICE_NORMAL) {
                const rand = Math.floor(Phaser.Math.random(0, this.intSounds.length));
                this.intSounds[rand].play();
            } else if (voice === QuestionManager.INT_VOICE_IMPRESSED) {
                this.sfx.intImpressed.play();
            } else {
                this.sfx.intDisappoint.play();
            }
        }

        dogSpeak(text: string, correct: boolean) {
            this.personSpeak(true, text);
            const words = text.split(' ');
            this.dog.speak(words.length);

            const soundBank = correct ? this.dogSoundsCorrect : this.dogSoundsWrong;
            const rand = Math.floor(Phaser.Math.random(0, soundBank.length));
            soundBank[rand].play();
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
            let r = Math.floor(Phaser.Math.random(0, this.data.bad_answers.length));
            let r2 = Math.floor(Phaser.Math.random(0, this.data.questions.length));
            let otherQ = this.data.questions[r2];

            this.correctAnswer = this.data.answers[q.a];
            this.incorrectAnswer = this.data.answers[otherQ.a];
            this.wrongAnswer = this.data.bad_answers[r];

            this.interviewerSpeak(q.q);

            this.speakerDone.addOnce(() => {
                this.showButtons(this.correctAnswer.button, this.incorrectAnswer.button, this.wrongAnswer.button);
            });
        }

        showButtons(correctAnswer: string, incorrectAnswer: string, badAnswer: string) {
            Phaser.ArrayUtils.shuffle(this.buttons);

            this.correctButton = this.buttons[0];
            this.incorrectButton = this.buttons[1];
            this.badButton = this.buttons[2];

            this.correctButton.text.setText(correctAnswer);
            this.incorrectButton.text.setText(incorrectAnswer);
            this.badButton.text.setText(badAnswer);

            this.thoughtBubble1.visible = true;
            this.bubbleSounds[0].play();

            this.game.time.events.add(600, () => {
                this.thoughtBubble2.visible = true;
                this.bubbleSounds[1].play();
            });

            this.game.time.events.add(1200, () => {
                this.bubbleSounds[2].play();
                this.buttons.forEach((button) => {
                    button.visible = true;
                    button.alpha = 1;
                });
            });
        }

        handleButtonPush(button: TextButton) {
            let buttonResult;

            this.sfx.click.play();

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
        }

        giveResponse(result: number) {
            this.hideSpeech(false);
            this.thoughtBubble1.visible = false;
            this.thoughtBubble2.visible = false;

            let trans;

            if (result === QuestionManager.B_RESULT_CORRECT) {
                trans = this.correctAnswer.correct;
            } else if (result === QuestionManager.B_RESULT_INCORRECT) {
                trans = this.incorrectAnswer.wrong;
            } else {
                trans = this.wrongAnswer.translation;
            }
            this.dogSpeak(trans, result === QuestionManager.B_RESULT_CORRECT);

            this.speakerDone.addOnce(() => {
                this.game.time.events.add(2000, this.interviewerResponse, this, result);
            });
        }

        interviewerResponse(result: number) {
            this.hideSpeech(true);

            let response, i, voice, endCondition;

            if (result === QuestionManager.B_RESULT_CORRECT) {
                i = Math.floor(Phaser.Math.random(0, this.data.positive_responses.length));
                response = this.data.positive_responses[i];
                voice = QuestionManager.INT_VOICE_IMPRESSED;
            } else {
                i = Math.floor(Phaser.Math.random(0, this.data.negative_responses.length));
                response = this.data.negative_responses[i];
                voice = QuestionManager.INT_VOICE_DISAPPOINT;
            }

            this.interviewerSpeak(response, voice);

            // pick next action based on result

            if (result === QuestionManager.B_RESULT_CORRECT) {
                this.correctCount++;
                endCondition = QuestionManager.RESULT_SUCCESS;
            } else {
                this.wrongCount++;
                endCondition = QuestionManager.RESULT_FAIL;
            }

            this.questionAnswered.dispatch(result);

            if (this.correctCount === QuestionManager.MAX_CORRECT || this.wrongCount === QuestionManager.MAX_WRONG) {
                this.speakerDone.addOnce(() => {
                    this.game.time.events.add(2000, this.endInterview, this, endCondition);
                });
            } else {
                this.speakerDone.addOnce(() => {
                    this.game.time.events.add(2000, this.askQuestion, this);
                });
            }
        }

        endInterview(result: boolean) {
            const endMsg = result === QuestionManager.RESULT_SUCCESS ?
                'Ok, that about covers all my questions. I think you\'ll make a great part of the team' :
                'I\'m going to have to stop you there. I\'m not sure this is right the place for you';

            this.interviewerSpeak(endMsg);

            this.speakerDone.addOnce(() => {
                this.gameOver.dispatch(result);
            });
        }

        clearThoughtBubbles() {
            this.thoughtBubble1.visible = false;
            this.thoughtBubble2.visible = false;

            this.buttons.forEach((button) => {
                button.visible = false;
            });
        }
    }
}
