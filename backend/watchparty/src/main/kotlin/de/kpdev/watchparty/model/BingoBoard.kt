package de.kpdev.watchparty.model

import jakarta.persistence.*
import org.apache.coyote.BadRequestException
import java.util.*

@Entity
class BingoBoard(
    @Id
    val id: UUID = UUID.randomUUID(),

    @OneToOne(cascade = [CascadeType.ALL], orphanRemoval = true)
    val owner: LobbyMember,

    val size: Int,

    @ElementCollection
    val events: MutableList<BingoFieldData> = mutableListOf(),

    @ManyToOne
    @JoinColumn(name = "bingo_game_id")
    var game: BingoGame
) {
    fun toggleTicks(wordsToTick: ArrayList<String>) {
        wordsToTick.forEach{ toggleTick(it) }
    }

    fun toggleTick(wordToTick: String) {
        val index = events.indexOfFirst { it.event == wordToTick }
        if (index == -1) {
            throw BadRequestException("There is no event for $wordToTick")
        }

        val value = events[index]
        events[index] = value.copy(ticked = !value.ticked)
    }

}

@Embeddable
data class BingoFieldData(
    val event: String,
    val ticked: Boolean
)