import com.example.bccintellijplugin.Adder
import com.example.bccintellijplugin.Deleter
import com.example.bccintellijplugin.defaultHeader
import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.actionSystem.CommonDataKeys
import com.intellij.openapi.command.WriteCommandAction
import com.intellij.psi.PsiFileFactory
import com.jetbrains.cidr.lang.OCLanguage


class RusAction : AnAction("Преукрасить в язык Древних Русов") {
    private val deleter = Deleter()
    private val adder = Adder()

    override fun actionPerformed(event: AnActionEvent) {
        val factory = PsiFileFactory.getInstance(event.project)

        val headerFile = factory.createFileFromText("Ве_крест_крест.h", OCLanguage.getInstance(), defaultHeader)
        val psiFile = event.getData(CommonDataKeys.PSI_FILE)!!


        WriteCommandAction.runWriteCommandAction(event.project) {
            psiFile.accept(deleter)
            deleter.deleteAll()
            psiFile.accept(adder)
            adder.addAll()
            psiFile.parent!!.files.firstOrNull { it.name == headerFile.name }?.delete()
            psiFile.parent!!.add(headerFile)
        }

        val editor = event.getData(CommonDataKeys.EDITOR)!!

        WriteCommandAction.runWriteCommandAction(event.project) {
            val document = editor.document
            document.setText(buildString {
                appendLine("#include \"Ве_крест_крест.h\"")
                append(document.text)
            })
        }
    }
}

