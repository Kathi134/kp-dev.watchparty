package de.kpdev.watchparty.model

import jakarta.persistence.*
import java.util.*

@Entity
class BingoGame(
    @Id
    val id: UUID = UUID.randomUUID(),

    @OneToOne @JoinColumn(name = "lobby_id")
    val lobby: Lobby,

    @ElementCollection
    val bingoEvents: MutableList<String> = mutableListOf(),

    @OneToMany(mappedBy = "game", cascade = [CascadeType.ALL], fetch = FetchType.EAGER)
    val bingoBoards: MutableList<BingoBoard> = mutableListOf()
) {
    fun isConfigComplete(memberId: UUID? = null): Boolean {
        if(memberId == null){
            return bingoBoards.size == lobby.members.size
        }
        return bingoBoards.any { it.owner.id == memberId }
    }

    fun createBoardForMember(member: LobbyMember, size: Int, values: List<String>) : BingoBoard {
        val events = values.map { BingoFieldData(it, false) }.toMutableList()
        val board = BingoBoard(owner = member, size = size, events = events, game = this)
        bingoBoards.add(board)

        return board
    }
}
