package de.kpdev.watchparty.repository

import de.kpdev.watchparty.model.Lobby
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface LobbyRepository : JpaRepository<Lobby, UUID>