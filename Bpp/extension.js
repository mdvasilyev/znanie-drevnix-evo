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

	context.subscriptions.push(  // основная функция
		vscode.commands.registerCommand("Bpp.Translate", () => {
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				const document = editor.document;
				editor.edit(editBuilder => {
					editor.selections.forEach(sel => {
						const range = sel.isEmpty ? document.getWordRangeAtPosition(sel.start) || sel : sel;
						let word = document.getText(range);
						let transformed = word.split('').map(() => 'a').join(''); // прям как в хаскеле
						editBuilder.replace(range, transformed);
					})
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