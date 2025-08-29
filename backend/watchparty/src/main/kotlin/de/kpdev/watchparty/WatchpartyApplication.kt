package de.kpdev.watchparty

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class WatchpartyApplication

fun main(args: Array<String>) {
    runApplication<WatchpartyApplication>(*args)
}
