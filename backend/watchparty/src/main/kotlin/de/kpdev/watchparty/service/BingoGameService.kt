package de.kpdev.watchparty.service

import de.kpdev.watchparty.dto.BingoGameDto
import de.kpdev.watchparty.dto.toDto
import de.kpdev.watchparty.model.BingoGame
import de.kpdev.watchparty.repository.BingoGameRepository
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Service
import java.util.*

@Service
class BingoGameService(
    private val gameRepository: BingoGameRepository,
    private val messagingTemplate: SimpMessagingTemplate
){
    fun addItem(lobbyId: UUID, item: String) : BingoGame {
        return manipulateItems(lobbyId, item, MutableList<String>::add)
    }

    fun removeItem(lobbyId: UUID, item: String) : BingoGame {
        return manipulateItems(lobbyId, item, MutableList<String>::remove)
    }

    private fun manipulateItems(
        lobbyId: UUID, subject: String,
        action: (MutableList<String>, String) -> Boolean) : BingoGame
    {
        val game = gameRepository.findByLobbyId(lobbyId)
            ?: throw RuntimeException("Lobby not started")

        action(game.bingoEvents, subject)

        val saved = gameRepository.save(game)
        messagingTemplate.convertAndSend("/topic/lobby/$lobbyId/game", saved.toDto())
        return saved
    }
}