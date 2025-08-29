package de.kpdev.watchparty.repository

import de.kpdev.watchparty.model.Lobby
import de.kpdev.watchparty.model.LobbyMember
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface LobbyMemberRepository : JpaRepository<LobbyMember, UUID>