package web

import (
	"bykevin.work/refiber/app/models"
	"github.com/gofiber/fiber/v2"
	support "github.com/refiber/framework/support"
	"github.com/rs/zerolog/log"
)

func (web *webController) Category() *categoryController {
	return &categoryController{*web}
}

type categoryController struct{ webController }

// Displays a page listing the data.
func (c *categoryController) Index(s support.Refiber) error {
	var categories []*models.Category

	if err := c.db.Order("created_at DESC").Find(&categories).Error; err != nil {
		log.Error().Err(err).Msg("CategoryController.Index")
	}

	return c.inertia.Render().Page("categories/Index", &fiber.Map{
		"categories": categories,
	})
}

// Displays a page for creating new data.
func (c *categoryController) Create(s support.Refiber) error {
	return c.inertia.Render().Page("categories/CreateOrEdit", nil)
}

// Handles a POST request to create new data.
func (c *categoryController) Store(s support.Refiber) error {
	type FormData struct {
		Title string `validate:"required,min=3,max=100"`
	}
	formData := new(FormData)

	// parse request body to formData
	if err := s.GetCtx().BodyParser(formData); err != nil {
		log.Error().Err(err).Msg("CategoryController.Store")
		return s.Redirect().Back().WithMessage(support.MessageTypeError, "Internal Server Error").Now()
	}

	// validate formData
	if err := s.Validate(formData); err != nil {
		return s.Redirect().Back().Now()
	}

	// save category data to db
	category := models.Category{
		Title: formData.Title,
	}
	if err := c.db.Create(&category).Error; err != nil {
		log.Error().Err(err).Msg("CategoryController.Store")
		return s.Redirect().Back().WithMessage(support.MessageTypeError, "Internal Server Error").Now()
	}

	return s.Redirect().To("/categories").WithMessage(support.MessageTypeSuccess, "Category successfully created!").Now()
}

// Displays a page showing detailed data.
func (c *categoryController) Show(s support.Refiber) error {
	return s.Redirect().Back().WithMessage(support.MessageTypeError, "You don't have access").Now()
}

// Displays a page for editing existing data.
func (c *categoryController) Edit(s support.Refiber) error {
	categoryID := s.GetCtx().Params("id")

	var category models.Category
	if err := c.db.Find(&category, categoryID).Error; err != nil {
		// TODO: check if not found
		log.Error().Err(err).Msg("CategoryController.Edit")
	}

	return c.inertia.Render().Page("categories/CreateOrEdit", &fiber.Map{
		"category": category,
	})
}

// Handles a PUT request to update data.
func (c *categoryController) Update(s support.Refiber) error {
	type FormData struct {
		Title string `validate:"required,min=3,max=100"`
	}
	formData := new(FormData)

	// parse request body to formData
	if err := s.GetCtx().BodyParser(formData); err != nil {
		log.Error().Err(err).Msg("CategoryController.Update")
		return s.Redirect().Back().WithMessage(support.MessageTypeError, "Internal Server Error").Now()
	}

	// validate formData
	if err := s.Validate(formData); err != nil {
		return s.Redirect().Back().Now()
	}

	// get category form db
	categoryID := s.GetCtx().Params("id")
	var category models.Category
	if err := c.db.Find(&category, categoryID).Error; err != nil {
		// TODO: check if not found
		log.Error().Err(err).Msg("CategoryController.Update")
		return s.Redirect().Back().WithMessage(support.MessageTypeError, "Internal Server Error").Now()
	}

	// update category data
	category.Title = formData.Title
	if err := c.db.Save(&category).Error; err != nil {
		log.Error().Err(err).Msg("CategoryController.Update")
		return s.Redirect().Back().WithMessage(support.MessageTypeError, "Internal Server Error").Now()
	}

	return s.Redirect().Back().WithMessage(support.MessageTypeSuccess, "Category successfully updated!").Now()
}

// Handles a DELETE request to delete data.
func (c *categoryController) Destroy(s support.Refiber) error {
	categoryID := s.GetCtx().Params("id")
	if err := c.db.Delete(&models.Category{}, categoryID).Error; err != nil {
		// TODO: check if not found
		log.Error().Err(err).Msg("CategoryController.Destroy")
	}

	return s.Redirect().To("/categories").WithMessage(support.MessageTypeSuccess, "Category successfully deleted!").Now()

}
