package web

import (
	"github.com/gofiber/fiber/v2"
	support "github.com/refiber/framework/support"
)

func (web *webController) Index(s support.Refiber, c *fiber.Ctx) error {
	return web.inertia.Render(c).Page("Home", nil)
}
