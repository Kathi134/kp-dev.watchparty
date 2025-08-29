package de.kpdev.watchparty.model

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.*

@Entity
class Lobby(
    @Id
    val id: UUID = UUID.randomUUID(),

    val createdAt: LocalDateTime = LocalDateTime.now(),

    @OneToMany(mappedBy = "lobby", cascade = [CascadeType.ALL], fetch = FetchType.EAGER)
    val members: MutableList<LobbyMember> = mutableListOf(),

    var state: LobbyState = LobbyState.CREATED,

    @OneToOne(mappedBy = "lobby", cascade = [CascadeType.ALL], orphanRemoval = true)
    var game: BingoGame? = null
) {

    fun addMember(userName: String) : LobbyMember {
        val existingNames = members.map { it.name }.toSet()

        var finalName = userName
        var counter = 1

        while (finalName in existingNames) {
            finalName = "$userName$counter"
            counter++
        }

        val newMember = LobbyMember(name = finalName, lobby = this)
        members.add(newMember)

        return newMember
    }

    fun startLobby() : BingoGame {
        state = LobbyState.RUNNING
        val game = BingoGame(lobby = this)
        this.game = game
        return game
    }
}

