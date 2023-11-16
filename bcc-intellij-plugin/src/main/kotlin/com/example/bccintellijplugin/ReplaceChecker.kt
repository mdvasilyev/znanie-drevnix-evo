package com.example.bccintellijplugin

import com.intellij.psi.PsiElement
import com.intellij.psi.impl.source.tree.LeafPsiElement
import com.jetbrains.cidr.lang.parser.OCKeywordElementType
import com.jetbrains.cidr.lang.parser.OCLexerTokenTypes
import com.jetbrains.cidr.lang.preprocessor.OCMacroForeignLeafElement

class ReplaceChecker {
    fun shoudReplace(element: PsiElement): Boolean {
        return element is LeafPsiElement && element !is OCMacroForeignLeafElement &&
                (element.elementType is OCKeywordElementType
                        || element.elementType == OCLexerTokenTypes.IDENTIFIER
                        || element.elementType == OCLexerTokenTypes.INTEGER_LITERAL)
    }
}