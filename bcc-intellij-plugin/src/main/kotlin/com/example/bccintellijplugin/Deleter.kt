package com.example.bccintellijplugin

import com.intellij.psi.PsiElement
import com.intellij.psi.PsiRecursiveElementVisitor
import com.jetbrains.cidr.lang.psi.impl.OCIncludeDirectiveImpl

class Deleter : PsiRecursiveElementVisitor() {
    private val toRemove = mutableListOf<PsiElement>()
    fun deleteAll() {
        toRemove.forEach { it.delete() }
        toRemove.clear()
    }

    override fun visitElement(element: PsiElement) {
        if (element is OCIncludeDirectiveImpl) {
            toRemove += element
            return
        }
        super.visitElement(element)
    }

}