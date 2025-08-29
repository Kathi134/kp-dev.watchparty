package de.kpdev.watchparty.dto

data class LobbyJoinResponse(
    val lobby: LobbyDto,
    val me: LobbyMemberDto
)
