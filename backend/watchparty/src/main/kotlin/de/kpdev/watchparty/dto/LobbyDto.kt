package de.kpdev.watchparty.dto

import de.kpdev.watchparty.model.Lobby
import de.kpdev.watchparty.model.LobbyState
import java.util.UUID

data class LobbyDto(
    val id: UUID,
    val members: List<LobbyMemberDto>,
    val state: LobbyState,
    val game: BingoGameDto? = null
)

fun Lobby.toDto() = LobbyDto(
    id = this.id,
    members = this.members.map { LobbyMemberDto(it.id, it.name) },
    state = this.state,
    game = this.game?.toDto()
)