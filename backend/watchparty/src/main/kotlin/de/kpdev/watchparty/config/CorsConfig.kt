package de.kpdev.watchparty.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class CorsConfig {

    @Bean
    fun corsConfigurer(): WebMvcConfigurer = object : WebMvcConfigurer {
        override fun addCorsMappings(registry: CorsRegistry) {
            registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000", "https://watchparty.kp-dev.de", "https://api.watchparty.kp-dev.de")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
        }
    }
}
