package de.kpdev.watchparty.service

import de.kpdev.watchparty.dto.CreateBoardRequest
import de.kpdev.watchparty.dto.toDto
import de.kpdev.watchparty.model.BingoBoard
import de.kpdev.watchparty.model.BingoGame
import de.kpdev.watchparty.repository.BingoGameRepository
import de.kpdev.watchparty.repository.LobbyMemberRepository
import org.apache.coyote.BadRequestException
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Service
import java.util.*

@Service
class BingoGameService(
    private val gameRepository: BingoGameRepository,
    private val messagingTemplate: SimpMessagingTemplate,
    private val lobbyMemberRepository: LobbyMemberRepository
){
    fun addItem(lobbyId: UUID, item: String) : BingoGame {
        val addClosure = {
            list: MutableList<String> ->
                list.add(0, item)
                true
        }
        return manipulateItems(lobbyId, addClosure)
    }

    fun removeItem(lobbyId: UUID, item: String) : BingoGame {
        val removeClosure = {
            list: MutableList<String> ->
                list.remove(item)
        }
        return manipulateItems(lobbyId, removeClosure)
    }

    private fun manipulateItems(
        lobbyId: UUID,
        action: (MutableList<String>) -> Boolean) : BingoGame
    {
        val game = gameRepository.findByLobbyId(lobbyId)
            ?: throw RuntimeException("Lobby not started")

        action(game.bingoEvents)

        val saved = gameRepository.save(game)
        messagingTemplate.convertAndSend("/topic/lobby/$lobbyId/game", saved.toDto())
        return saved
    }

    fun createBoard(lobbyId: UUID, body: CreateBoardRequest) : BingoBoard {
        val game = gameRepository.findByLobbyId(lobbyId)
            ?: throw RuntimeException("Lobby not started")

        val member = lobbyMemberRepository.findById(body.memberId)
            .orElseThrow{ Exception("Lobby Member not found") }

        // TODO: if already exists, overwrite

        val board = game.createBoardForMember(member, size = body.size, values = body.values)

        val savedGame = gameRepository.save(game)
        messagingTemplate.convertAndSend("/topic/lobby/$lobbyId/game", savedGame.toDto())

        return board;
    }

    fun checkConfigurationState(lobbyId: UUID, memberId: UUID?) : Boolean {
        val game = gameRepository.findByLobbyId(lobbyId)
            ?: throw RuntimeException("Lobby not started")

        return game.isConfigComplete(memberId)
    }

    fun readBoards(lobbyId: UUID): List<BingoBoard> {
        val game = gameRepository.findByLobbyId(lobbyId)
            ?: throw RuntimeException("Lobby not started")

        return game.bingoBoards
    }

    fun tickFields(lobbyId: UUID, memberId: UUID, wordsToToggleTick: ArrayList<String>): BingoBoard {
        val game = gameRepository.findByLobbyId(lobbyId)
            ?: throw RuntimeException("Lobby not started")


        val board = game.bingoBoards.find { it.owner.id == memberId}
            ?: throw BadRequestException("member $memberId not found.")

        board.toggleTicks(wordsToToggleTick)

        val savedGame = gameRepository.save(game)
        messagingTemplate.convertAndSend("/topic/lobby/$lobbyId/game", savedGame.toDto())

        return board
    }

    fun readBoard(lobbyId: UUID, memberId: UUID): BingoBoard =
        readBoards(lobbyId).find { it.owner.id  == memberId }
            ?: throw BadRequestException("member $memberId not found.")

}