package middleware

import (
	"errors"

	"github.com/refiber/framework/support"
	"github.com/rs/zerolog/log"
	"gorm.io/gorm"

	"bykevin.work/refiber/app/models"
	"github.com/gofiber/fiber/v2"
)

func (m *middleware) AuthWeb(c *fiber.Ctx) error {
	var user *models.User
	m.app.GetAuthenticatedUserSession(&user)

	if user == nil {
		return support.AuthLoginPage("/login", m.app.Refiber)
	}

	// err := m.app.DB.QueryRowxContext(c.Context(), "SELECT * FROM users WHERE id = ?", user.ID).StructScan(user)
	if err := m.app.DB.First(user, user.ID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			log.Error().Err(err).Msg("middleware.AuthWeb")
		}

		return support.AuthLoginPage("/login", m.app.Refiber)
	}

	if err := m.app.UpdateAuthenticatedUserSession(user); err != nil {
		log.Error().Err(err)
		return support.AuthLoginPage("/login", m.app.Refiber)
	}

	return c.Next()
}
