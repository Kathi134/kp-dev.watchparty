package de.kpdev.watchparty.model

import de.kpdev.watchparty.dto.LobbyDto
import jakarta.persistence.ElementCollection
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.OneToOne
import java.util.UUID

@Entity
data class BingoGame(
    @Id
    val id: UUID = UUID.randomUUID(),

    @OneToOne @JoinColumn(name = "lobby_id")
    val lobby: Lobby,

    @ElementCollection
    val bingoEvents: MutableList<String> = mutableListOf()
)
