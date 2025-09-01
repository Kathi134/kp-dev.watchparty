package de.kpdev.watchparty.dto

import de.kpdev.watchparty.model.Lobby
import de.kpdev.watchparty.model.LobbyState
import java.util.UUID

data class LobbyDto(
    val id: UUID,
    val name: String,
    val members: List<LobbyMemberDto>,
    val state: LobbyState,
    val game: BingoGameDto? = null
)

fun Lobby.toDto() = LobbyDto(
    id = this.id,
    name = this.name ?: this.id.toString(),
    members = this.members.map { it.toDto() },
    state = this.state,
    game = this.game?.toDto()
)