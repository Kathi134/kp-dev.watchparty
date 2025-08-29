package de.kpdev.watchparty.controller

import de.kpdev.watchparty.dto.toDto
import de.kpdev.watchparty.service.BingoGameService
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/lobbies/{lobbyId}/game")
class BingoGameController(
    private val bingoGameService: BingoGameService,
) {
    @PostMapping("/events/add")
    fun addItem(@PathVariable lobbyId: UUID, @RequestBody item: String) =
        bingoGameService.addItem(lobbyId, item).toDto()

    @PostMapping("/events/remove")
    fun removeItem(@PathVariable lobbyId: UUID, @RequestBody item: String) =
        bingoGameService.removeItem(lobbyId, item).toDto()
}