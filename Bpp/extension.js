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
		if (line.text.startsWith('#include')) {
			editBuilder.delete(range);
		} else if (!line.isEmptyOrWhitespace) {
			const splittedLine = line.text.match(/[\p{L}\p{N}]+|[.,\/#!$%\^&\*;:{}=\-_`~()+*/%]|\s/gu);
			
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
		vscode.commands.registerCommand("Bpp.Translate", () => {
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				editor.edit(editBuilder => {
					parseDocument(editor.document, editBuilder);
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