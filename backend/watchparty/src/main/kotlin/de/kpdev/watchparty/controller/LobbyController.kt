package de.kpdev.watchparty.controller

import de.kpdev.watchparty.dto.*
import de.kpdev.watchparty.service.LobbyService
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/lobbies")
class LobbyController(private val lobbyService: LobbyService) {

    @GetMapping
    fun listLobbies(): List<LobbyDto> =
        lobbyService.getAllLobbies().map { it.toDto() }

    @PostMapping
    fun createLobby(): LobbyDto =
        lobbyService.createLobby().toDto()

    @GetMapping("/{id}")
    fun getLobby(@PathVariable id: UUID): LobbyDto =
        lobbyService.getLobby(id).toDto()

    @PutMapping("/{id}/name")
    fun editLobbyName(@PathVariable id: UUID, @RequestBody name: String): LobbyDto =
        lobbyService.updateLobbyName(id, name).toDto()

    @PostMapping("/{id}/join")
    fun joinLobby(@PathVariable id: UUID): LobbyJoinResponse {
        val (lobby, me) = lobbyService.joinLobby(id, "guest")
        return LobbyJoinResponse(lobby.toDto(), me.toDto())
    }

    @PostMapping("/{id}/leave")
    fun leaveLobby(@PathVariable id: UUID, @RequestBody request: LeaveLobbyRequest) =
        lobbyService.leaveLobby(id, request.memberId)

    @PutMapping("/{lobbyId}/members/{memberId}/name")
    fun editMemberName(@PathVariable lobbyId: UUID, @PathVariable memberId: UUID, @RequestBody name: String) : LobbyDto =
        lobbyService.updateLobbyMemberName(lobbyId, memberId, name).toDto()

    @PostMapping("/{id}/start")
    fun startLobby(@PathVariable id: UUID): LobbyDto =
        lobbyService.startLobby(id).toDto()

}
