package middleware

import (
	"github.com/gofiber/fiber/v2"

	"bykevin.work/refiber/app/models"
)

func (m *middleware) Guest(c *fiber.Ctx) error {
	auth := m.app.Auth(c)

	var user *models.User
	auth.GetAuthenticatedUserSession(&user)

	if user != nil {
		return c.Redirect("/")
	}

	return c.Next()
}
