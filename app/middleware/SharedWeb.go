package middleware

import (
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog/log"
)

func (m *middleware) SharedWeb(c *fiber.Ctx) error {
	data := fiber.Map{
		"env": os.Getenv("APP_ENV"),
	}

	if err := m.app.SetSharedData(data); err != nil {
		log.Error().Err(err).Msg("middleware.Shared: failed to set Shared Data")
	}

	return c.Next()
}
