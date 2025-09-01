package de.kpdev.watchparty.controller

import de.kpdev.watchparty.dto.BingoBoardDto
import de.kpdev.watchparty.dto.CreateBoardRequest
import de.kpdev.watchparty.dto.toDto
import de.kpdev.watchparty.service.BingoGameService
import org.apache.coyote.BadRequestException
import org.springframework.web.bind.annotation.*
import java.util.*
import kotlin.collections.ArrayList

@RestController
@RequestMapping("/lobbies/{lobbyId}/game")
class BingoGameController(
    private val bingoGameService: BingoGameService,
) {

    // TODO: events Post, remove add
    @PostMapping("/events/add")
    fun addItem(@PathVariable lobbyId: UUID, @RequestBody item: String) =
        bingoGameService.addItem(lobbyId, item).toDto()

    // TODO: delete mapping
    @PostMapping("/events/remove")
    fun removeItem(@PathVariable lobbyId: UUID, @RequestBody item: String) =
        bingoGameService.removeItem(lobbyId, item).toDto()

    @PostMapping("/boards")
    fun createBoard(@PathVariable lobbyId: UUID, @RequestBody body: CreateBoardRequest) : BingoBoardDto {
        if(body.size * body.size != body.values.size)
            throw BadRequestException("Size of board (${body.size}x${body.size} does not match given values (${body.values.size}).")
        return bingoGameService.createBoard(lobbyId, body).toDto()
    }

    @GetMapping("/boards")
    fun readBoards(@PathVariable lobbyId: UUID): List<BingoBoardDto> =
        bingoGameService.readBoards(lobbyId).map { it.toDto() }

    @GetMapping("/boards/{memberId}")
    fun readBoard(@PathVariable lobbyId: UUID, @PathVariable memberId: UUID): BingoBoardDto =
        bingoGameService.readBoard(lobbyId, memberId).toDto()

    @PutMapping("/boards/{memberId}/ticks")
    fun updateTicks(@PathVariable lobbyId: UUID, @PathVariable memberId: UUID, @RequestBody ticks: ArrayList<String>): BingoBoardDto =
        bingoGameService.tickFields(lobbyId, memberId, ticks).toDto()

    @GetMapping("/configured/{memberId}")
    fun checkConfigurationState(@PathVariable lobbyId: UUID, @PathVariable memberId: UUID?) : Boolean =
        bingoGameService.checkConfigurationState(lobbyId, memberId)

}

