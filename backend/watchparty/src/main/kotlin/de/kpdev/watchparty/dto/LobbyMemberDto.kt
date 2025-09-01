package de.kpdev.watchparty.dto

import de.kpdev.watchparty.model.LobbyMember
import java.util.*

data class LobbyMemberDto (
    val id: UUID,
    val name: String,
)

fun LobbyMember.toDto(): LobbyMemberDto =
    LobbyMemberDto(this.id, this.name)