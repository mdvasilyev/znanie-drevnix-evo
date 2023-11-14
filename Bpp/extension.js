const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	context.subscriptions.push( // оставил, для примера
		vscode.commands.registerCommand("Bpp.hello", () => {
			vscode.window.showInformationMessage("Hello,");
		})
	);

	context.subscriptions.push(  // оставил, для примера
		vscode.commands.registerCommand("Bpp.world", () => {
			vscode.window.showWarningMessage("Warning! Ha Ha");
		})
	);

	context.subscriptions.push(  // оставил, для примера
		vscode.commands.registerCommand("Bpp.showTime", () => {
			var newDate = new Date()
			vscode.window.showInformationMessage(newDate.toLocaleTimeString());
		})
	);
	
	function translateFile(editor, dictionary) {
		editor.edit(editBuilder => {
			const document = editor.document;
			for (let lineIndex = 0; lineIndex < document.lineCount; lineIndex++) {
				const line = document.lineAt(lineIndex);
				const range = new vscode.Range(line.range.start, line.range.end);
				if (line.text.startsWith('#include')) {
					editBuilder.delete(range);
				} else if (line.text.length >= 2) {
					var splitted = line.text.match(/\b\w+\b|[.,\/#!$%\^&\*;:{}=\-_`~()]/g);
					for (let i = 0; i < splitted.length; i++) {
						if (splitted[i] in dictionary) {
							splitted[i] = dictionary[splitted[i]];
						}
					}
					editBuilder.replace(range, splitted.join(' '));
				}
			}
			const must_have = '#include "../header/Ве_крест_крест.h"\n\nвнедрить хутор Русь;';
			editBuilder.insert(document.lineAt(0).range.start, must_have);
		});
	}

	const myDict = {
		'if': 'если',
		'size_t': 'мерило',
		'void': 'ничто'
	};

	context.subscriptions.push(vscode.commands.registerCommand('Bpp.Translate', () => {
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				translateFile(editor, myDict);
			}
		})
	);

	// context.subscriptions.push(  // основная функция
	// 	vscode.commands.registerCommand("Bpp.Translate", () => {
	// 		const editor = vscode.window.activeTextEditor;
	// 		if (editor) {
	// 			const document = editor.document;
	// 			editor.edit(editBuilder => {
	// 				editor.selections.forEach(sel => {
	// 					const range = sel.isEmpty ? document.getWordRangeAtPosition(sel.start) || sel : sel;
	// 					let word = document.getText(range);
	// 					let transformed = word.split('').map(() => 'a').join(''); // прям как в хаскеле
	// 					editBuilder.replace(range, transformed);
	// 				})
	// 			})
	// 		}
	// 	})
	// );
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}