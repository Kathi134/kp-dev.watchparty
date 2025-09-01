package de.kpdev.watchparty.dto

import java.util.*

data class CreateBoardRequest(
    val memberId: UUID,
    val size: Int,
    val values: MutableList<String>
)