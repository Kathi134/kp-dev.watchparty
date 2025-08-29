package de.kpdev.watchparty.repository

import de.kpdev.watchparty.model.BingoGame
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface BingoGameRepository  : JpaRepository<BingoGame, UUID> {
    fun findByLobbyId(lobbyId: UUID): BingoGame?
}