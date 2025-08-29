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
    fun createLobby(): LobbyDto {
        return lobbyService.createLobby().toDto()
    }

    @GetMapping("/{id}")
    fun getLobby(@PathVariable id: UUID): LobbyDto =
        lobbyService.getLobby(id).toDto()

    @PostMapping("/{id}/join")
    fun joinLobby(@PathVariable id: UUID): LobbyJoinResponse {
        val (lobby, me) = lobbyService.joinLobby(id, "guest")
        return LobbyJoinResponse(lobby.toDto(), LobbyMemberDto(me.id, me.name))
    }

    @PostMapping("/{id}/leave")
    fun leaveLobby(@PathVariable id: UUID, @RequestBody request: LeaveLobbyRequest) {
        lobbyService.leaveLobby(id, request.memberId)
    }

    @PostMapping("/{id}/start")
    fun startLobby(@PathVariable id: UUID): LobbyDto =
        lobbyService.startLobby(id).toDto()

}
