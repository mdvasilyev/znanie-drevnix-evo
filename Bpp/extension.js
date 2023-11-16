const vscode = require('vscode');
const fs = require("fs");
const path = require("path")

/**
 * @param {vscode.ExtensionContext} context
*/
function activate(context) {

	const filePath = path.join(__dirname, 'dictionary.json');
	const json = fs.readFileSync(filePath, 'utf8');
	const dictionary = new Map(Object.entries(JSON.parse(json)))


	/**
	 * @param {RegExpMatchArray} splittedLine
	 * @param {number} [index]
	 */
	function skipWhitespace(splittedLine, index) {
		index++;
		while (/\s/.test(splittedLine[index])) {
			index++;
		}
		return index;
	}


	/**
	 * @param {RegExpMatchArray} splittedLine
	 */
	function isIncludeLine(splittedLine) {
		const index = skipWhitespace(splittedLine, -1);
		return splittedLine[index] == '#' && splittedLine[index + 1] == 'include';
	}


	/**
	 * @param {RegExpMatchArray} splittedLine
	 */
	function concatSomeWords(splittedLine) {
		let result = [];

		const sl = splittedLine.length
		for (let index = 0; index < sl; index++) {
			if (splittedLine[index] === 'int') {
				index = skipWhitespace(splittedLine, index);
				if (splittedLine[index] === 'main') {
					result.push('int main');
				} else {
					result.push('int');
					result.push(' ');
					result.push(splittedLine[index]);
				}
			} else if (splittedLine[index] === 'long') {
				index = skipWhitespace(splittedLine, index);
				if (splittedLine[index] === 'long') {
					result.push('long long');
				} else {
					result.push('long');
					result.push(' ');
					result.push(splittedLine[index]);
				}
			} else if (splittedLine[index] === 'size'
				&& splittedLine[index + 1] === '_'
				&& splittedLine[index + 2] === 't') {
				index += 2;
				result.push('size_t');
			} else {
				result.push(splittedLine[index]);
			}
		}

		return result;
	}


	/**
	 * @param {vscode.TextLine} line
	 * @param {vscode.TextEditorEdit} editBuilder
	 */
	function parseLine(line, editBuilder) {
		const range = new vscode.Range(line.range.start, line.range.end);

		if (!line.isEmptyOrWhitespace) {
			const splittedLine = line.text.match(/[\p{L}\p{N}]+|[.,\/#!$%\^&\*;:{}\[\]=<>"'\-_`~()+*/%]|\s/gu);

			if (isIncludeLine(splittedLine)) {
				editBuilder.delete(range);
				return;
			}

			const lineAfterConcats = concatSomeWords(splittedLine);

			const replaced = lineAfterConcats.map((elem) => {
				if (dictionary.has(elem)) {
					return dictionary.get(elem);
				}
				return elem;
			});

			editBuilder.replace(range, replaced.join(''));
		}
	}


	/**
	 * @param {vscode.TextDocument} document
	 * @param {vscode.TextEditorEdit} editBuilder
	 */
	function parseDocument(document, editBuilder) {
		const documentLines = document.lineCount;
		for (let lineIndex = 0; lineIndex < documentLines; lineIndex++) {
			const line = document.lineAt(lineIndex);
			parseLine(line, editBuilder);
		}

		const must_have = '#include "../header/Ве_крест_крест.h"';
		editBuilder.insert(document.lineAt(0).range.start, must_have);
	};

	context.subscriptions.push(
		vscode.commands.registerCommand("Bpp.translate", () => {

			vscode.window.showInformationMessage("Славься Русь!");

			const editor = vscode.window.activeTextEditor;
			if (editor) {
				editor.edit(editBuilder => {
					parseDocument(editor.document, editBuilder);
				})
			}
		})
	);


	/**
	   * @param {vscode.TextDocument} document
	   * @param {vscode.TextEditorEdit} editBuilder
	   * @param {string} txtFileNumber
	   */
	function insertASCII(document, editBuilder, txtFileNumber) {
		let txtFilePath;
		switch (parseInt(txtFileNumber)) {
			case 1:
				txtFilePath = path.join(__dirname, 'ascii-arts/ascii-b++.txt');
				break;
			case 2:
				txtFilePath = path.join(__dirname, 'ascii-arts/ascii-lect.txt');
				break;
			case 3:
				txtFilePath = path.join(__dirname, 'ascii-arts/ascii-lizards-must-die-1.txt');
				break;
			case 4:
				txtFilePath = path.join(__dirname, 'ascii-arts/ascii-lizards-must-die-2.txt');
				break;
			case 5:
				txtFilePath = path.join(__dirname, 'ascii-arts/ascii-text-art.txt');
				break;
			default:
				vscode.window.showErrorMessage('Неверный счет, пиши от целкового (1) до пудовичка (5)');
				return;
		}
		const content = fs.readFileSync(txtFilePath, 'utf-8');
		const fullRange = new vscode.Range(0, 0, document.lineCount, 0);
		editBuilder.delete(fullRange);
		editBuilder.insert(document.lineAt(0).range.start, content);
	}


	context.subscriptions.push(
		vscode.commands.registerCommand("Bpp.ASCII", async () => {
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				const txtFileNumber = await vscode.window.showInputBox({
					prompt: 'Укажи счет от целкового до пудовичка',
					validateInput: value => {
						const num = parseInt(value);
						return isNaN(num) || num < 1 || num > 5 ? 'Неверный счет, пиши от целкового до пудовичка' : null;
					}
				});
				if (txtFileNumber !== undefined) {
					editor.edit(editBuilder => {
						insertASCII(editor.document, editBuilder, txtFileNumber);
					})
				}
			}
		})
	)

    const provider = new CustomSidebarProvider(context.extensionUri);


	context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            "hitLizard-sidebar",
            provider
        )
    );


    context.subscriptions.push(
        vscode.commands.registerCommand("Bpp.hitLizard", () => {
            const message = "Бей ящера слева!";
            vscode.window.showInformationMessage(message);
        })
    )
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}

class CustomSidebarProvider {
  static get viewType() {
    return 'vscodeSidebar.openview';
  }

  constructor(extensionUri) {
    this._extensionUri = extensionUri;
    this._view = undefined;
  }

  resolveWebviewView(webviewView, context, token) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this.getHtmlContent(webviewView.webview);
  }

  getHtmlContent(webview) {
    const imagePath = vscode.Uri.file(path.join(__dirname, 'pics/capsule_616x353.jpg'));
    const imageSrc = webview.asWebviewUri(imagePath);
	const imagePath2 = vscode.Uri.file(path.join(__dirname, 'pics/russ-lizard-1.jpeg'));
    const imageSrc2 = webview.asWebviewUri(imagePath2);
	const imagePath3 = vscode.Uri.file(path.join(__dirname, 'pics/russ-lizard-2.jpeg'));
    const imageSrc3 = webview.asWebviewUri(imagePath3);
	const imagePath4 = vscode.Uri.file(path.join(__dirname, 'pics/bogatiri.png'));
    const imageSrc4 = webview.asWebviewUri(imagePath4);
    return `
        <!DOCTYPE html>
        <html>
            <head>
                <style>
                    body { margin: 0; }
                    img { width: 100%; height: 100%; }
                </style>
            </head>
            <body>
                <img src="${imageSrc}" alt="My Image">
                <p>👊 Бейте 🐍 ящеров, слушайте 📜 лекции профессора Багирова, да пейте воду 🍵 байкальскую, братья 💪 Русы 💪, и тогда узнаете вы, что 🪲 багов в ваших 📜 берестяных грамотах будет появляться гораздо меньше. Да пребудет с вами мощь ⚡ Перуна ⚡</p>
				<img src="${imageSrc2}" alt="My Image 2">
            	<img src="${imageSrc3}" alt="My Image 3">
				<img src="${imageSrc4}" alt="My Image 3">
            </body>
        </html>
    `;
  }
}
