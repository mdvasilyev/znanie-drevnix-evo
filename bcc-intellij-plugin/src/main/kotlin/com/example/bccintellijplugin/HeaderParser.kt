package com.example.bccintellijplugin

class HeaderParser {
    fun parseHeader(header: String): Map<String, String> {
        val mapping = mutableMapOf<String, String>()
        header.lines().groupBy { line ->
            val tokens = line.split(" ")
            when {
                tokens[0] == "#define" && tokens.size > 2 -> {
                    val what = tokens.drop(2).joinToString(" ")
                    val to = tokens[1]
                    mapping[what] = to
                }

                tokens[0] == "внедрить" -> {
                    val what = tokens[3].dropLast(1)
                    val to = tokens[1]
                    mapping[what] = to
                }

                line.startsWith("перепись счёт_древних_русов") -> {
                    val defines = tokens.drop(2).dropLast(1)
                    for (i in 0 until defines.size / 3) {
                        val what = if (i + 1 == defines.size / 3) {
                            defines[3 * i + 2]
                        } else {
                            defines[3 * i + 2].dropLast(1)
                        }
                        val to = defines[3 * i]
                        mapping[what] = to
                    }
                }
            }
        }

        return mapping
    }
}