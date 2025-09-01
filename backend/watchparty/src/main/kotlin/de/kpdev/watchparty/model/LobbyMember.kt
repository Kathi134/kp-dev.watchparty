package de.kpdev.watchparty.model

import jakarta.persistence.*
import java.util.*

@Entity
data class LobbyMember(
    @Id
    val id: UUID = UUID.randomUUID(),

    var name: String,

    @ManyToOne
    @JoinColumn(name = "lobby_id")
    val lobby: Lobby
)