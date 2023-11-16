package com.example.bccintellijplugin

import com.intellij.psi.PsiElement
import com.intellij.psi.impl.source.tree.LeafPsiElement
import com.jetbrains.cidr.lang.psi.visitors.OCRecursiveVisitor

class Adder : OCRecursiveVisitor() {
    private val replaceChecker = ReplaceChecker()
    private val toReplace = mutableListOf<LeafPsiElement>()

    override fun visitElement(element: PsiElement) {
        super.visitElement(element)
        if (replaceChecker.shoudReplace(element)) {
            toReplace += element as LeafPsiElement
        }
    }

    fun addAll() {
        for (element in toReplace.asReversed()) {
            val to = defaultDefinitions[element.text] ?: continue
            element.replaceWithText(to)
        }
        toReplace.clear()
    }
}