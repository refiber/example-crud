package middleware

import (
	"bykevin.work/refiber/app/models"
	"github.com/gofiber/fiber/v2"
)

func (m *middleware) Guest(c *fiber.Ctx) error {
	var user *models.User
	m.app.GetAuthenticatedUserSession(&user)

	if user != nil {
		return c.Redirect("/")
	}

	return c.Next()
}
