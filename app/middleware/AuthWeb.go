package middleware

import (
	"errors"

	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog/log"
	"gorm.io/gorm"

	"bykevin.work/refiber/app/models"
)

func (m *middleware) AuthWeb(c *fiber.Ctx) error {
	auth := m.app.Auth(c)

	var user *models.User
	auth.GetAuthenticatedUserSession(&user)

	if user == nil {
		return auth.LoginPage("/login")
	}

	// err := m.app.DB.QueryRowxContext(c.Context(), "SELECT * FROM users WHERE id = ?", user.ID).StructScan(user)
	if err := m.app.DB.First(user, user.ID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			log.Error().Err(err).Msg("middleware.AuthWeb")
		}

		return auth.LoginPage("/login")
	}

	if err := auth.UpdateAuthenticatedUserSession(user); err != nil {
		log.Error().Err(err)
		return auth.LoginPage("/login")
	}

	return c.Next()
}
