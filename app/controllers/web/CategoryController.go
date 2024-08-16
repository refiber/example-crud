package web

import (
	"github.com/gofiber/fiber/v2"
	support "github.com/refiber/framework/support"
	"github.com/rs/zerolog/log"

	"bykevin.work/refiber/app/models"
)

func (web *webController) Category() *categoryController {
	return &categoryController{*web}
}

type categoryController struct{ webController }

// Displays a page listing the data.
func (ctr *categoryController) Index(s support.Refiber, c *fiber.Ctx) error {
	var categories []*models.Category

	if err := ctr.db.Order("created_at DESC").Find(&categories).Error; err != nil {
		log.Error().Err(err).Msg("CategoryController.Index")
	}

	return ctr.inertia.Render(c).Page("categories/Index", &fiber.Map{
		"categories": categories,
	})
}

// Displays a page for creating new data.
func (ctr *categoryController) Create(s support.Refiber, c *fiber.Ctx) error {
	return ctr.inertia.Render(c).Page("categories/CreateOrEdit", nil)
}

// Handles a POST request to create new data.
func (ctr *categoryController) Store(s support.Refiber, c *fiber.Ctx) error {
	type FormData struct {
		Title string `validate:"required,min=3,max=100"`
	}
	formData := new(FormData)

	redirect := s.Redirect(c)

	// parse request body to formData
	if err := c.BodyParser(formData); err != nil {
		log.Error().Err(err).Msg("CategoryController.Store")
		return redirect.Back().WithMessage(support.MessageTypeError, "Internal Server Error").Now()
	}

	validation := s.Validation(c)

	// validate formData
	if err := validation.Validate(formData); err != nil {
		return redirect.Back().Now()
	}

	// save category data to db
	category := models.Category{
		Title: formData.Title,
	}
	if err := ctr.db.Create(&category).Error; err != nil {
		log.Error().Err(err).Msg("CategoryController.Store")
		return redirect.Back().WithMessage(support.MessageTypeError, "Internal Server Error").Now()
	}

	return redirect.To("/categories").WithMessage(support.MessageTypeSuccess, "Category successfully created!").Now()
}

// Displays a page showing detailed data.
func (ctr *categoryController) Show(s support.Refiber, c *fiber.Ctx) error {
	return s.Redirect(c).Back().WithMessage(support.MessageTypeError, "You don't have access").Now()
}

// Displays a page for editing existing data.
func (ctr *categoryController) Edit(s support.Refiber, c *fiber.Ctx) error {
	categoryID := c.Params("id")

	var category models.Category
	if err := ctr.db.Find(&category, categoryID).Error; err != nil {
		// TODO: check if not found
		log.Error().Err(err).Msg("CategoryController.Edit")
	}

	return ctr.inertia.Render(c).Page("categories/CreateOrEdit", &fiber.Map{
		"category": category,
	})
}

// Handles a PUT request to update data.
func (ctr *categoryController) Update(s support.Refiber, c *fiber.Ctx) error {
	type FormData struct {
		Title string `validate:"required,min=3,max=100"`
	}
	formData := new(FormData)

	redirect := s.Redirect(c)

	// parse request body to formData
	if err := c.BodyParser(formData); err != nil {
		log.Error().Err(err).Msg("CategoryController.Update")
		return redirect.Back().WithMessage(support.MessageTypeError, "Internal Server Error").Now()
	}

	validation := s.Validation(c)

	// validate formData
	if err := validation.Validate(formData); err != nil {
		return redirect.Back().Now()
	}

	// get category form db
	categoryID := c.Params("id")
	var category models.Category
	if err := ctr.db.Find(&category, categoryID).Error; err != nil {
		// TODO: check if not found
		log.Error().Err(err).Msg("CategoryController.Update")
		return redirect.Back().WithMessage(support.MessageTypeError, "Internal Server Error").Now()
	}

	// update category data
	category.Title = formData.Title
	if err := ctr.db.Save(&category).Error; err != nil {
		log.Error().Err(err).Msg("CategoryController.Update")
		return redirect.Back().WithMessage(support.MessageTypeError, "Internal Server Error").Now()
	}

	return redirect.Back().WithMessage(support.MessageTypeSuccess, "Category successfully updated!").Now()
}

// Handles a DELETE request to delete data.
func (ctr *categoryController) Destroy(s support.Refiber, c *fiber.Ctx) error {
	categoryID := c.Params("id")
	if err := ctr.db.Delete(&models.Category{}, categoryID).Error; err != nil {
		// TODO: check if not found
		log.Error().Err(err).Msg("CategoryController.Destroy")
	}

	return s.Redirect(c).To("/categories").WithMessage(support.MessageTypeSuccess, "Category successfully deleted!").Now()
}
