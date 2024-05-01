package middleware

import "bykevin.work/refiber/app"

func Setup(app *app.App) *middleware {
	return &middleware{app: *app}
}

type middleware struct {
	app app.App
}
