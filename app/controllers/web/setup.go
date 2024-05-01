package web

import (
	"github.com/refiber/framework/inertia"
	"gorm.io/gorm"

	"bykevin.work/refiber/app"
)

func Setup(app *app.App) *webController {
	inertia := inertia.New(app.Refiber)
	return &webController{inertia: inertia, db: app.DB}
}

type webController struct {
	inertia inertia.InertiaInterface
	db      *gorm.DB
}
