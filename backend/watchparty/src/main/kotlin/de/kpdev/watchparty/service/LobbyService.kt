package de.kpdev.watchparty.service

import de.kpdev.watchparty.dto.BingoGameDto
import de.kpdev.watchparty.dto.LobbyDto
import de.kpdev.watchparty.dto.toDto
import de.kpdev.watchparty.model.BingoGame
import de.kpdev.watchparty.model.Lobby
import de.kpdev.watchparty.model.LobbyMember
import de.kpdev.watchparty.model.LobbyState
import de.kpdev.watchparty.repository.BingoGameRepository
import de.kpdev.watchparty.repository.LobbyMemberRepository
import de.kpdev.watchparty.repository.LobbyRepository
import org.springframework.stereotype.Service
import org.springframework.messaging.simp.SimpMessagingTemplate
import java.util.*

@Service
class LobbyService(
    private val lobbyRepository: LobbyRepository,
    private val memberRepository: LobbyMemberRepository,
    private val bingoGameRepository: BingoGameRepository, // TODO iwie mit ner startegy auslagern / flexibler machen
    private val messagingTemplate: SimpMessagingTemplate
) {

    fun getAllLobbies(): List<Lobby> = lobbyRepository.findAll()

    fun createLobby(): Lobby {
        val lobby = Lobby()
        return lobbyRepository.save(lobby)
    }

    fun getLobby(id: UUID): Lobby =
        lobbyRepository.findById(id).orElseThrow { RuntimeException("Lobby not found") }

    fun joinLobby(lobbyId: UUID, userName: String): Pair<Lobby, LobbyMember> {
        var lobby = getLobby(lobbyId)
        val member = lobby.addMember(userName)
        lobby = lobbyRepository.save(lobby)

        messagingTemplate.convertAndSend("/topic/lobby/${lobby.id}", lobby.toDto())
        return Pair(lobby, member)
    }

    fun leaveLobby(lobbyId: UUID, memberId: UUID) {
        val lobby = getLobby(lobbyId)
        val member = memberRepository.findById(memberId)
            .orElseThrow { RuntimeException("Member not found") }

        memberRepository.delete(member)
        lobby.members.removeIf { it.id == memberId }

        // Delete lobby if empty
        if (lobby.members.isEmpty()) {
            lobbyRepository.delete(lobby)
        }
        else {
            // Broadcast updated lobby
            messagingTemplate.convertAndSend("/topic/lobby/${lobby.id}", lobby.toDto())
        }
    }

    fun startLobby(id: UUID): Lobby {
        val lobby = lobbyRepository.findById(id).orElseThrow { RuntimeException("Lobby not found") }

        if (lobby.game != null || lobby.state == LobbyState.RUNNING) {
            throw RuntimeException("Game already started")
        }

        // TODO: evtl jede lobby mit einer game strategy ausstatten sodass flexibel games gestartet werden können

        lobby.startLobby()
        val savedLobby = lobbyRepository.save(lobby)

        messagingTemplate.convertAndSend("/topic/lobby/$id", savedLobby.toDto())
        return savedLobby
    }
}