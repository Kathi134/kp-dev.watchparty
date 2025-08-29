package de.kpdev.watchparty.dto

import de.kpdev.watchparty.model.BingoGame
import java.util.*

data class BingoGameDto(
    val id: UUID,
    val lobbyId: UUID,
    val bingoEvents: List<String>
)

fun BingoGame.toDto() = BingoGameDto(id = id, lobbyId = lobby.id, bingoEvents = bingoEvents)