package de.kpdev.watchparty.dto

import de.kpdev.watchparty.model.BingoBoard
import java.util.*
import kotlin.collections.LinkedHashMap

data class BingoBoardDto(
    val id: UUID,
    val size: Int,
    val events: Map<String, Boolean>,
    val ownerId: UUID,
    val ownerName: String
)

fun BingoBoard.toDto() : BingoBoardDto =
    BingoBoardDto(
        id = this.id,
        size = this.size,
        events = this.events.associate { it.event to it.ticked },
        ownerId = this.owner.id,
        ownerName = this.owner.name
    )
