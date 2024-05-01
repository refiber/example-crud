package web

import (
	support "github.com/refiber/framework/support"
)

func (web *webController) Index(s support.Refiber) error {
	return web.inertia.Render().Page("Home", nil)
}
