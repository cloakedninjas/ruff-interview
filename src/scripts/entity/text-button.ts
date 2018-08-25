module Hrj.Entity {
    export class TextButton extends Phaser.Button {
        text: Phaser.Text;

        addText(text: Phaser.Text) {
            this.text = text;
            this.addChild(this.text);
        }
    }
}
