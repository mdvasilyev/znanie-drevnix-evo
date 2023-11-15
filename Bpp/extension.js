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
	 * @param { vscode.TextDocument } document
	 */
	function parseCppCode(document) {
		const docSize = document.lineCount;
		for (let i = 0; i < docSize; i++) {
			const line = document.lineAt(i);
			const range = new vscode.Range(line.range.start, line.range.end);
			var splitted = line.text.match(/[\p{L}\p{N}]+|[.,\/#!$%\^&\*;:{}=\-_`~()]/gu);
			const s = splitted.forEach(elem => {
				console.log("Current word: " + elem);
				if (dictionary.has(elem)) {
					elem = dictionary.get(elem);
				}
			});
			console.log(splitted)
		}
	};

	context.subscriptions.push(
		vscode.commands.registerCommand("Bpp.Translate", () => {
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				editor.edit(editBuilder => {
					const document = editor.document;
					for (let lineIndex = 0; lineIndex < document.lineCount; lineIndex++) {
						const line = document.lineAt(lineIndex);
						const range = new vscode.Range(line.range.start, line.range.end);
						if (line.text.startsWith('#include')) {
							editBuilder.delete(range);
						} else if (line.text.length >= 2) {
							var splitted = line.text.match(/[\p{L}\p{N}]+|[.,\/#!$%\^&\*;:{}=\-_`~()]/gu);
							const replaced = splitted.map((elem) => {
								if (dictionary.has(elem)) {
									return dictionary.get(elem);
								}
								return elem;
							});
							editBuilder.replace(range, replaced.join(' '));
						}
					}
					const must_have = '#include "../header/Ве_крест_крест.h"';
					editBuilder.insert(document.lineAt(0).range.start, must_have);
				
					if (document.lineAt(2).text != 'внедрить хутор Русь;' && document.lineAt(2).text != 'внедрить хутор Русь ;') {
						const must_have = 'внедрить хутор Русь;\n';
						editBuilder.insert(document.lineAt(2).range.start, must_have);
					}
				})
			}
		})
	);

}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}