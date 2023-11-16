package com.example.bccintellijplugin

import RusAction

val defaultHeader = RusAction::class.java
    .classLoader
    .getResourceAsStream("Ве_крест_крест.h")!!
    .readAllBytes().toString(Charsets.UTF_8)

val defaultDefinitions = HeaderParser().parseHeader(defaultHeader)
