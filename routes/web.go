package routes

import (
	"github.com/refiber/framework/router"

	"bykevin.work/refiber/app"
	"bykevin.work/refiber/app/controllers/web"
	"bykevin.work/refiber/app/middleware"
)

func RegisterWeb(route router.RouterInterface, app *app.App) {
	m := middleware.Setup(app)
	controller := web.Setup(app)

	route.Get("/", controller.Index, m.AuthWeb)

	route.Get("/login", controller.Login, m.Guest)
	route.Post("/login", controller.Auth)
	route.Post("/logout", controller.Logout)

	/**
	 * docs: https://www.notion.so/refiber/Refiber-Docs-613336569bcd439ca74c27e30d46a491?pvs=4#f073facf2c954b7dbe5df78be6477202
	 * rout.CRUD(/products) will generates:
	 *
	 * [GET]      /products                Index()
	 * [GET]      /products/create         Create()
	 * [POST]     /products/create         Store()
	 * [GET]      /products/:id            Show()
	 * [GET]      /products/:id/edit       Edit()
	 * [PUT]      /products/:id/edit       Update()
	 * [DELETE]   /products/:id/destroy    Destroy()
	 */
	route.CRUD("/products", func(crud *router.Crud) {
		// TODO: add crud.except = Show
		crud.Controller = controller.Product()
	}, m.AuthWeb)

	route.CRUD("/categories", func(crud *router.Crud) {
		// TODO: add crud.except = Show
		crud.Controller = controller.Category()
	}, m.AuthWeb)
}
