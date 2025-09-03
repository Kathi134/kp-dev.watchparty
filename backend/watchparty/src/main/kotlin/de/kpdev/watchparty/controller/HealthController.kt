package de.kpdev.watchparty.controller

import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/health")
class HealthController {

    @GetMapping
    fun addItem() : String =
        "Hello World"
}